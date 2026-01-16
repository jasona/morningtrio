'use client';

import { useState } from 'react';
import type { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TaskInput } from './TaskInput';
import { cn } from '@/lib/utils';

interface TopThreeSelectionProps {
  tasks: Task[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onAddTask: (text: string, section: 'mustDo' | 'other') => void;
  onContinue: () => void;
}

export function TopThreeSelection({
  tasks,
  selectedIds,
  onToggleSelect,
  onAddTask,
  onContinue,
}: TopThreeSelectionProps) {
  const [addingTo, setAddingTo] = useState<'mustDo' | 'other' | null>(null);

  const canSelectMore = selectedIds.length < 3;
  const mustDoTasks = tasks.filter((t) => selectedIds.includes(t.id));
  const otherTasks = tasks.filter((t) => !selectedIds.includes(t.id));

  const handleAddTask = (text: string) => {
    if (addingTo) {
      onAddTask(text, addingTo);
      setAddingTo(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Choose Your Top 3</h2>
        <p className="text-sm text-muted-foreground">
          Select up to 3 tasks to focus on today. You can also add new tasks.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-primary">
              Must Do Today ({selectedIds.length}/3)
            </h3>
            {canSelectMore && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setAddingTo('mustDo')}
                className="text-xs"
              >
                + Add new
              </Button>
            )}
          </div>
          
          {addingTo === 'mustDo' && (
            <div className="p-3 bg-primary/5 rounded-lg">
              <TaskInput
                onAddTask={handleAddTask}
                placeholder="Add a priority task..."
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setAddingTo(null)}
                className="mt-2 text-xs"
              >
                Cancel
              </Button>
            </div>
          )}

          {mustDoTasks.length > 0 ? (
            <div className="space-y-2">
              {mustDoTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20"
                >
                  <Checkbox
                    checked={true}
                    onCheckedChange={() => onToggleSelect(task.id)}
                  />
                  <span className="flex-1 text-sm">{task.text}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-3 text-center border border-dashed rounded-lg">
              Select tasks from below to add to your top 3
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              Other Tasks ({otherTasks.length})
            </h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setAddingTo('other')}
              className="text-xs"
            >
              + Add new
            </Button>
          </div>

          {addingTo === 'other' && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <TaskInput
                onAddTask={handleAddTask}
                placeholder="Add another task..."
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setAddingTo(null)}
                className="mt-2 text-xs"
              >
                Cancel
              </Button>
            </div>
          )}

          {otherTasks.length > 0 ? (
            <div className="space-y-2">
              {otherTasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-all",
                    canSelectMore
                      ? "hover:border-primary/50 cursor-pointer"
                      : "opacity-60"
                  )}
                  onClick={() => canSelectMore && onToggleSelect(task.id)}
                >
                  <Checkbox
                    checked={false}
                    disabled={!canSelectMore}
                    onCheckedChange={() => onToggleSelect(task.id)}
                  />
                  <span className="flex-1 text-sm">{task.text}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-3 text-center">
              No other tasks
            </p>
          )}
        </div>
      </div>

      <Button
        onClick={onContinue}
        className="w-full"
        size="lg"
      >
        {selectedIds.length === 0 ? 'Skip Top 3' : `Confirm ${selectedIds.length} Priority Task${selectedIds.length !== 1 ? 's' : ''}`}
      </Button>
    </div>
  );
}
