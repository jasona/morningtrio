'use client';

import { useTasks } from '@/hooks/useTasks';
import { useAppState } from '@/hooks/useAppState';
import { TaskInput } from '@/components/TaskInput';
import { TaskList } from '@/components/TaskList';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
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

export default function Home() {
  const {
    tasks,
    mustDoTasks,
    otherTasks,
    isLoading,
    addTask,
    toggleComplete,
    deleteTask,
    moveToSection,
    reorderTasks,
    clearCompleted,
  } = useTasks();

  const { isHydrated } = useAppState();

  const completedCount = tasks.filter((t) => t.completed).length;
  const canAddToMustDo = mustDoTasks.length < 3;

  const handleAddTask = async (text: string) => {
    await addTask(text, 'other');
  };

  if (!isHydrated || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading your tasks...</p>
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <header className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-foreground">MorningTrio</h1>
        <p className="text-sm text-muted-foreground">
          Focus on your top 3 priorities today
        </p>
      </header>

      <TaskInput onAddTask={handleAddTask} />

      {!canAddToMustDo && (
        <p className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg text-center">
          Top 3 is full! Complete or move a task to add more.
        </p>
      )}

      <TaskList
        mustDoTasks={mustDoTasks}
        otherTasks={otherTasks}
        onToggleComplete={toggleComplete}
        onDelete={deleteTask}
        onMoveToSection={moveToSection}
        onReorder={reorderTasks}
      />

      {completedCount > 0 && (
        <div className="flex justify-center pt-4">
          {completedCount === 1 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={clearCompleted}
              className="text-muted-foreground"
            >
              <Trash2 className="size-4 mr-2" />
              Clear completed task
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-muted-foreground"
                >
                  <Trash2 className="size-4 mr-2" />
                  Clear {completedCount} completed tasks
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear completed tasks?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove {completedCount} completed tasks.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearCompleted}>
                    Clear tasks
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )}
    </main>
  );
}
