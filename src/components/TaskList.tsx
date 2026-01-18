'use client';

import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState } from 'react';
import type { Task, TaskSection } from '@/types/task';
import { DroppableSection } from './DroppableSection';
import { TaskItem } from './TaskItem';
import { cn } from '@/lib/utils';

interface TaskListProps {
  mustDoTasks: Task[];
  otherTasks: Task[];
  completedTasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onMoveToSection: (id: string, section: TaskSection) => void;
  onReorder: (section: TaskSection, orderedIds: string[]) => void;
}

export function TaskList({
  mustDoTasks,
  otherTasks,
  completedTasks,
  onToggleComplete,
  onDelete,
  onMoveToSection,
  onReorder,
}: TaskListProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const canMoveToMustDo = mustDoTasks.length < 3;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = [...mustDoTasks, ...otherTasks].find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = [...mustDoTasks, ...otherTasks].find((t) => t.id === activeId);
    if (!activeTask) return;

    const overSection = over.data.current?.section as TaskSection | undefined;
    const overTask = [...mustDoTasks, ...otherTasks].find((t) => t.id === overId);
    const targetSection = overSection || overTask?.section;

    if (!targetSection) return;

    if (activeTask.section !== targetSection) {
      if (targetSection === 'mustDo' && mustDoTasks.length >= 3) {
        return;
      }
      onMoveToSection(activeId, targetSection);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeTask = [...mustDoTasks, ...otherTasks].find((t) => t.id === activeId);
    if (!activeTask) return;

    const section = activeTask.section;
    const sectionTasks = section === 'mustDo' ? mustDoTasks : otherTasks;

    const oldIndex = sectionTasks.findIndex((t) => t.id === activeId);
    const newIndex = sectionTasks.findIndex((t) => t.id === overId);

    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      const newOrder = [...sectionTasks];
      const [removed] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, removed);
      onReorder(section, newOrder.map((t) => t.id));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        <section aria-labelledby="must-do-heading">
          <div
            className={cn(
              "rounded-2xl p-4 space-y-3",
              "bg-gradient-to-br from-primary/5 to-accent/10",
              "border-2 border-primary/20"
            )}
          >
            <h2
              id="must-do-heading"
              className="text-sm font-semibold text-primary flex items-center gap-2"
            >
              <span className="inline-flex items-center justify-center size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {mustDoTasks.filter((t) => !t.completed).length}
              </span>
              Must Do Today
            </h2>

            {mustDoTasks.length === 0 ? (
              <DroppableSection
                id="mustDo"
                tasks={[]}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onMoveToSection={onMoveToSection}
                canMoveToMustDo={canMoveToMustDo}
              >
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Drag tasks here or tap the arrow to add your top 3 priorities.
                </p>
              </DroppableSection>
            ) : (
              <DroppableSection
                id="mustDo"
                tasks={mustDoTasks}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onMoveToSection={onMoveToSection}
                canMoveToMustDo={canMoveToMustDo}
              />
            )}
          </div>
        </section>

        <section aria-labelledby="other-tasks-heading">
          <h2
            id="other-tasks-heading"
            className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2"
          >
            <span className="inline-flex items-center justify-center size-5 rounded-full bg-muted text-muted-foreground text-xs">
              {otherTasks.length}
            </span>
            Other Tasks
          </h2>

          {otherTasks.length === 0 ? (
            <DroppableSection
              id="other"
              tasks={[]}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onMoveToSection={onMoveToSection}
              canMoveToMustDo={canMoveToMustDo}
            >
              <p className="text-sm text-muted-foreground py-4 text-center border border-dashed border-border rounded-xl">
                No other tasks. Use the input above to add tasks.
              </p>
            </DroppableSection>
          ) : (
            <DroppableSection
              id="other"
              tasks={otherTasks}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onMoveToSection={onMoveToSection}
              canMoveToMustDo={canMoveToMustDo}
            />
          )}
        </section>

        {completedTasks.length > 0 && (
          <section aria-labelledby="completed-tasks-heading">
            <h2
              id="completed-tasks-heading"
              className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2"
            >
              <span className="inline-flex items-center justify-center size-5 rounded-full bg-muted text-muted-foreground text-xs">
                {completedTasks.length}
              </span>
              Completed
            </h2>
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="opacity-90 shadow-xl scale-105">
            <TaskItem
              task={activeTask}
              onToggleComplete={() => {}}
              onDelete={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
