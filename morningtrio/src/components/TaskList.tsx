'use client';

import type { Task, TaskSection } from '@/types/task';
import { TaskItem } from './TaskItem';
import { cn } from '@/lib/utils';

interface TaskListProps {
  mustDoTasks: Task[];
  otherTasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onMoveToSection: (id: string, section: TaskSection) => void;
}

export function TaskList({
  mustDoTasks,
  otherTasks,
  onToggleComplete,
  onDelete,
  onMoveToSection,
}: TaskListProps) {
  const canMoveToMustDo = mustDoTasks.length < 3;

  return (
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
              {mustDoTasks.filter(t => !t.completed).length}
            </span>
            Must Do Today
          </h2>

          {mustDoTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No must-do tasks yet. Add up to 3 priority tasks.
            </p>
          ) : (
            <div className="space-y-2">
              {mustDoTasks.map((task) => (
                <TaskItem
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
          <p className="text-sm text-muted-foreground py-4 text-center border border-dashed border-border rounded-xl">
            No other tasks. Use the input above to add tasks.
          </p>
        ) : (
          <div className="space-y-2">
            {otherTasks.map((task) => (
              <TaskItem
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
        )}
      </section>
    </div>
  );
}
