'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useAppState } from '@/hooks/useAppState';
import { useAuth } from '@/hooks/useAuth';
import { TaskInput } from '@/components/TaskInput';
import { TaskList } from '@/components/TaskList';
import { TaskListSwitcher } from '@/components/TaskListSwitcher';
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
    isHydrated,
    activeTaskList,
    needsPlanning,
    workNeedsPlanning,
    personalNeedsPlanning,
    setActiveTaskList,
    completePlanning,
    skipPlanning,
  } = useAppState();

  const {
    tasks,
    mustDoTasks,
    otherTasks,
    completedTasks,
    isLoading,
    addTask,
    updateTask,
    toggleComplete,
    deleteTask,
    moveToSection,
    switchTaskList,
    reorderTasks,
    clearCompleted,
    getIncompleteTasks,
  } = useTasks(activeTaskList);

  const [showPlanning, setShowPlanning] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const prevAllCompleteRef = useRef(false);
  const planningInitializedRef = useRef<{ work: boolean; personal: boolean }>({
    work: false,
    personal: false,
  });

  // Compute incomplete tasks dynamically from current tasks state
  const incompleteTasks = getIncompleteTasks();

  // Filter all tasks by active list for planning
  const listTasks = tasks.filter((t) => t.taskList === activeTaskList);

  useEffect(() => {
    // Only initialize planning once per list
    if (planningInitializedRef.current[activeTaskList]) return;

    if (isHydrated && needsPlanning && !isLoading && !authLoading) {
      planningInitializedRef.current[activeTaskList] = true;
      // Only show planning if user has existing tasks to review
      // New users with no tasks skip directly to the main app
      if (incompleteTasks.length > 0 || listTasks.length > 0) {
        setShowPlanning(true);
      } else {
        // Auto-complete planning for new users with no tasks
        completePlanning();
      }
    }
  }, [isHydrated, needsPlanning, isLoading, authLoading, incompleteTasks.length, listTasks.length, completePlanning, activeTaskList]);

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

  const handleKeepTask = useCallback((id: string) => {
    updateTask(id, { createdDate: new Date().toISOString().split('T')[0] });
  }, [updateTask]);

  const handleDismissTask = useCallback((id: string) => {
    deleteTask(id);
  }, [deleteTask]);

  const handleEditTask = useCallback((id: string, newText: string) => {
    updateTask(id, { text: newText, createdDate: new Date().toISOString().split('T')[0] });
  }, [updateTask]);

  const handlePlanningComplete = useCallback(() => {
    completePlanning();
    setShowPlanning(false);
  }, [completePlanning]);

  const handleSkipPlanning = useCallback(() => {
    skipPlanning();
    setShowPlanning(false);
  }, [skipPlanning]);

  const completedCount = completedTasks.length;
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
        taskList={activeTaskList}
        incompleteTasks={incompleteTasks}
        allTasks={listTasks}
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
              Your top 3 {activeTaskList} priorities
            </p>
          </div>
          <AuthStatus />
        </header>

        <TaskListSwitcher
          activeList={activeTaskList}
          onSwitch={setActiveTaskList}
          workNeedsPlanning={workNeedsPlanning}
          personalNeedsPlanning={personalNeedsPlanning}
        />

        <TaskInput onAddTask={handleAddTask} />

        {!canAddToMustDo && (
          <p className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg text-center">
            Top 3 is full! Complete or move a task to add more.
          </p>
        )}

        <TaskList
          mustDoTasks={mustDoTasks}
          otherTasks={otherTasks}
          completedTasks={completedTasks}
          onToggleComplete={toggleComplete}
          onDelete={deleteTask}
          onMoveToSection={moveToSection}
          onSwitchTaskList={switchTaskList}
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
