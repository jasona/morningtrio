'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Task, TaskSection } from '@/types/task';
import { SortableTaskItem } from './SortableTaskItem';
import { cn } from '@/lib/utils';

interface DroppableSectionProps {
  id: TaskSection;
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onMoveToSection: (id: string, section: TaskSection) => void;
  canMoveToMustDo: boolean;
  children?: React.ReactNode;
}

export function DroppableSection({
  id,
  tasks,
  onToggleComplete,
  onDelete,
  onMoveToSection,
  canMoveToMustDo,
  children,
}: DroppableSectionProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: {
      section: id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[60px] rounded-xl transition-colors",
        isOver && "bg-primary/5 ring-2 ring-primary/20"
      )}
    >
      {children}
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {tasks.map((task) => (
            <SortableTaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onMoveToSection={onMoveToSection}
              showMoveButtons
              canMoveToMustDo={canMoveToMustDo}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
