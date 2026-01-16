'use client';

import { useState, useEffect } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Task } from '@/types/task';

export function ClaimLocalTasks() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { getLocalTasks, claimLocalTasks, clearLocalTasks } = useTasks();
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function checkLocalTasks() {
      if (isAuthenticated && !authLoading) {
        const tasks = await getLocalTasks();
        if (tasks.length > 0) {
          setLocalTasks(tasks);
          setIsOpen(true);
        }
      }
    }

    checkLocalTasks();
  }, [isAuthenticated, authLoading, getLocalTasks]);

  async function handleClaim() {
    setIsProcessing(true);
    await claimLocalTasks();
    setIsOpen(false);
    setIsProcessing(false);
  }

  async function handleStartFresh() {
    setIsProcessing(true);
    await clearLocalTasks();
    setIsOpen(false);
    setIsProcessing(false);
  }

  if (!isOpen || localTasks.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome back!</DialogTitle>
          <DialogDescription>
            We found {localTasks.length} task{localTasks.length !== 1 ? 's' : ''} from before you signed in.
            Would you like to add them to your account?
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-40 overflow-y-auto rounded-md border p-3">
          <ul className="space-y-1 text-sm">
            {localTasks.map((task) => (
              <li key={task.id} className="flex items-center gap-2">
                <span className={task.completed ? 'text-muted-foreground line-through' : ''}>
                  {task.text}
                </span>
                {task.section === 'mustDo' && (
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                    Must Do
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={handleStartFresh}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            Start fresh
          </Button>
          <Button
            onClick={handleClaim}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            {isProcessing ? 'Processing...' : 'Claim tasks'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
