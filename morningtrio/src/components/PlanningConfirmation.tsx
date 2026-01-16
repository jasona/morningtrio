'use client';

import type { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface PlanningConfirmationProps {
  topThreeTasks: Task[];
  onComplete: () => void;
}

const motivationalMessages = [
  "You've got this! Let's make today count.",
  "Small steps lead to big achievements.",
  "Focus on progress, not perfection.",
  "Today is full of possibilities.",
  "You're ready to tackle the day!",
];

export function PlanningConfirmation({
  topThreeTasks,
  onComplete,
}: PlanningConfirmationProps) {
  const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mb-4">
          <CheckCircle2 className="size-8" />
        </div>
        <h2 className="text-xl font-semibold">You&apos;re All Set!</h2>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>

      {topThreeTasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-primary">Your Top 3 for Today</h3>
          <div className="space-y-2">
            {topThreeTasks.map((task, index) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20"
              >
                <span className="inline-flex items-center justify-center size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {index + 1}
                </span>
                <span className="flex-1 text-sm text-left">{task.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {topThreeTasks.length === 0 && (
        <p className="text-sm text-muted-foreground py-4">
          No priority tasks selected. You can add them from the main view.
        </p>
      )}

      <Button onClick={onComplete} className="w-full" size="lg">
        Start Your Day
      </Button>
    </div>
  );
}
