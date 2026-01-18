'use client';

import { cn } from '@/lib/utils';
import type { TaskListType } from '@/types/task';
import { Briefcase, Home } from 'lucide-react';

interface TaskListSwitcherProps {
  activeList: TaskListType;
  onSwitch: (list: TaskListType) => void;
  workNeedsPlanning?: boolean;
  personalNeedsPlanning?: boolean;
}

export function TaskListSwitcher({
  activeList,
  onSwitch,
  workNeedsPlanning,
  personalNeedsPlanning,
}: TaskListSwitcherProps) {
  return (
    <div className="flex bg-muted rounded-xl p-1 gap-1">
      <button
        onClick={() => onSwitch('personal')}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
          activeList === 'personal'
            ? "bg-background shadow-sm text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Home className="size-4" />
        Personal
        {personalNeedsPlanning && activeList !== 'personal' && (
          <span className="size-2 rounded-full bg-primary animate-pulse" />
        )}
      </button>
      <button
        onClick={() => onSwitch('work')}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
          activeList === 'work'
            ? "bg-background shadow-sm text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Briefcase className="size-4" />
        Work
        {workNeedsPlanning && activeList !== 'work' && (
          <span className="size-2 rounded-full bg-primary animate-pulse" />
        )}
      </button>
    </div>
  );
}
