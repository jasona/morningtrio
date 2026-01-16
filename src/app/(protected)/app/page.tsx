'use client';

import { useState, useEffect, useRef } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useAppState } from '@/hooks/useAppState';
import { useAuth } from '@/hooks/useAuth';
import { TaskInput } from '@/components/TaskInput';
import { TaskList } from '@/components/TaskList';
import { MorningPlanning } from '@/components/MorningPlanning';
import { CelebrationModal } from '@/components/CelebrationModal';
import { AuthStatus } from '@/components/AuthStatus';
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

export default function AppPage() {
  const { isLoading: authLoading } = useAuth();
  const {
    tasks,
    mustDoTasks,
    otherTasks,
    isLoading,
    addTask,
    updateTask,
    toggleComplete,
    deleteTask,
    moveToSection,
    reorderTasks,
    clearCompleted,
    getIncompleteTasks,
  } = useTasks();

  const {
    isHydrated,
    needsPlanning,
    completePlanning,
    skipPlanning,
  } = useAppState();

  const [showPlanning, setShowPlanning] = useState(false);
  const [incompleteTasks, setIncompleteTasks] = useState<typeof tasks>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const prevAllCompleteRef = useRef(false);

  useEffect(() => {
    if (isHydrated && needsPlanning && !isLoading && !authLoading && !showPlanning) {
      const incomplete = getIncompleteTasks();
      // Only show planning if user has existing tasks to review
      // New users with no tasks skip directly to the main app
      if (incomplete.length > 0 || tasks.length > 0) {
        setIncompleteTasks(incomplete);
        setShowPlanning(true);
      } else {
        // Auto-complete planning for new users with no tasks
        completePlanning();
      }
    }
  }, [isHydrated, needsPlanning, isLoading, authLoading, showPlanning, getIncompleteTasks, tasks.length, completePlanning]);

  const allMustDoComplete = mustDoTasks.length === 3 && mustDoTasks.every((t) => t.completed);

  useEffect(() => {
    if (allMustDoComplete && !prevAllCompleteRef.current) {
      const timer = setTimeout(() => {
        setShowCelebration(true);
      }, 0);
      return () => clearTimeout(timer);
    }
    prevAllCompleteRef.current = allMustDoComplete;
  }, [allMustDoComplete]);

  const handleKeepTask = (id: string) => {
    updateTask(id, { createdDate: new Date().toISOString().split('T')[0] });
  };

  const handleDismissTask = (id: string) => {
    deleteTask(id);
  };

  const handleEditTask = (id: string, newText: string) => {
    updateTask(id, { text: newText, createdDate: new Date().toISOString().split('T')[0] });
  };

  const handlePlanningComplete = () => {
    completePlanning();
    setShowPlanning(false);
  };

  const handleSkipPlanning = () => {
    skipPlanning();
    setShowPlanning(false);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const canAddToMustDo = mustDoTasks.length < 3;

  const handleAddTask = async (text: string) => {
    await addTask(text, 'other');
  };

  if (!isHydrated || isLoading || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading your tasks...</p>
      </div>
    );
  }

  if (showPlanning) {
    return (
      <MorningPlanning
        incompleteTasks={incompleteTasks}
        allTasks={tasks}
        onKeepTask={handleKeepTask}
        onDismissTask={handleDismissTask}
        onEditTask={handleEditTask}
        onAddTask={addTask}
        onMoveToSection={moveToSection}
        onComplete={handlePlanningComplete}
        onSkip={handleSkipPlanning}
      />
    );
  }

  return (
    <>
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
      />
      <main className="space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">MorningTrio</h1>
            <p className="text-sm text-muted-foreground">
              Focus on your top 3 priorities today
            </p>
          </div>
          <AuthStatus />
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
    </>
  );
}
