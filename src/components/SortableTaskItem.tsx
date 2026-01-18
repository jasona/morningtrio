'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskItem } from './TaskItem';
import type { Task, TaskSection, TaskListType } from '@/types/task';
import { cn } from '@/lib/utils';

interface SortableTaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onMoveToSection?: (id: string, section: TaskSection) => void;
  onSwitchTaskList?: (id: string, targetList: TaskListType) => void;
  showMoveButtons?: boolean;
  canMoveToMustDo?: boolean;
}

export function SortableTaskItem({
  task,
  onToggleComplete,
  onDelete,
  onMoveToSection,
  onSwitchTaskList,
  showMoveButtons = false,
  canMoveToMustDo = true,
}: SortableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      task,
      section: task.section,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        isDragging && "opacity-50 z-50 shadow-lg scale-[1.02]",
        "transition-shadow"
      )}
    >
      <TaskItem
        task={task}
        onToggleComplete={onToggleComplete}
        onDelete={onDelete}
        onMoveToSection={onMoveToSection}
        onSwitchTaskList={onSwitchTaskList}
        showMoveButtons={showMoveButtons}
        canMoveToMustDo={canMoveToMustDo}
        dragHandleProps={{
          ...attributes,
          ...listeners,
        }}
      />
    </div>
  );
}
