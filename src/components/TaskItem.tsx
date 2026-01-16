'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type { Task, TaskSection } from '@/types/task';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onMoveToSection?: (id: string, section: TaskSection) => void;
  showMoveButtons?: boolean;
  canMoveToMustDo?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
}

export function TaskItem({
  task,
  onToggleComplete,
  onDelete,
  onMoveToSection,
  showMoveButtons = false,
  canMoveToMustDo = true,
  dragHandleProps,
}: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    onDelete(task.id);
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-3 min-h-[44px] px-3 py-2 rounded-xl transition-all",
        "bg-card border border-border/50",
        "hover:border-border hover:shadow-sm",
        task.completed && "opacity-60",
        isDeleting && "scale-95 opacity-0"
      )}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        aria-label="Drag to reorder"
        {...dragHandleProps}
      >
        <GripVertical className="size-4" />
      </button>

      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggleComplete(task.id)}
        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        className={cn(
          "transition-all duration-200",
          task.completed && "data-[state=checked]:bg-primary/70"
        )}
      />

      <span
        className={cn(
          "flex-1 text-sm transition-all",
          task.completed && "line-through text-muted-foreground"
        )}
      >
        {task.text}
      </span>

      {showMoveButtons && onMoveToSection && (
        <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity">
          {task.section === 'other' && canMoveToMustDo && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onMoveToSection(task.id, 'mustDo')}
              aria-label="Move to Must Do Today"
              className="text-primary"
            >
              <ArrowUp className="size-4" />
            </Button>
          )}
          {task.section === 'mustDo' && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onMoveToSection(task.id, 'other')}
              aria-label="Move to Other Tasks"
              className="text-muted-foreground"
            >
              <ArrowDown className="size-4" />
            </Button>
          )}
        </div>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            aria-label="Delete task"
          >
            <Trash2 className="size-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{task.text.length > 50 ? task.text.slice(0, 50) + '...' : task.text}&quot;.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
