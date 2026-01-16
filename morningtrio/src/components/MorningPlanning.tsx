'use client';

import { useState, useEffect } from 'react';
import type { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { CarryoverStep } from './CarryoverStep';
import { TopThreeSelection } from './TopThreeSelection';
import { PlanningConfirmation } from './PlanningConfirmation';
import { cn } from '@/lib/utils';

type PlanningStep = 'welcome' | 'carryover' | 'top-three' | 'confirmation';

interface MorningPlanningProps {
  incompleteTasks: Task[];
  allTasks: Task[];
  onKeepTask: (id: string) => void;
  onDismissTask: (id: string) => void;
  onEditTask: (id: string, newText: string) => void;
  onAddTask: (text: string, section: 'mustDo' | 'other') => Promise<Task>;
  onMoveToSection: (id: string, section: 'mustDo' | 'other') => void;
  onComplete: () => void;
  onSkip: () => void;
}

export function MorningPlanning({
  incompleteTasks,
  allTasks,
  onKeepTask,
  onDismissTask,
  onEditTask,
  onAddTask,
  onMoveToSection,
  onComplete,
  onSkip,
}: MorningPlanningProps) {
  const [step, setStep] = useState<PlanningStep>('welcome');
  const [selectedTopThree, setSelectedTopThree] = useState<string[]>([]);
  const [keptTasks, setKeptTasks] = useState<Task[]>([]);

  const hasCarryover = incompleteTasks.length > 0;

  useEffect(() => {
    if (step === 'welcome') {
      const timer = setTimeout(() => {
        if (hasCarryover) {
          setStep('carryover');
        } else {
          setStep('top-three');
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, hasCarryover]);

  const handleCarryoverContinue = () => {
    setStep('top-three');
  };

  const handleKeepTask = (id: string) => {
    onKeepTask(id);
    const task = incompleteTasks.find((t) => t.id === id);
    if (task) {
      setKeptTasks((prev) => [...prev, task]);
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedTopThree.includes(id)) {
      setSelectedTopThree((prev) => prev.filter((i) => i !== id));
      onMoveToSection(id, 'other');
    } else if (selectedTopThree.length < 3) {
      setSelectedTopThree((prev) => [...prev, id]);
      onMoveToSection(id, 'mustDo');
    }
  };

  const handleAddTask = async (text: string, section: 'mustDo' | 'other') => {
    const newTask = await onAddTask(text, section);
    if (section === 'mustDo' && selectedTopThree.length < 3) {
      setSelectedTopThree((prev) => [...prev, newTask.id]);
    }
  };

  const handleTopThreeContinue = () => {
    setStep('confirmation');
  };

  const handleComplete = () => {
    onComplete();
  };

  const currentStepIndex = ['welcome', 'carryover', 'top-three', 'confirmation'].indexOf(step);
  const totalSteps = hasCarryover ? 4 : 3;
  const adjustedStepIndex = hasCarryover ? currentStepIndex : Math.max(0, currentStepIndex - 1);

  const topThreeTasks = allTasks.filter((t) => t.section === 'mustDo');
  const availableTasks = [...keptTasks, ...allTasks.filter((t) => !incompleteTasks.some((it) => it.id === t.id))];

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="flex-1 overflow-auto">
        <div className="min-h-full flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md space-y-8">
            {step !== 'welcome' && (
              <div className="flex justify-center gap-2">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i <= adjustedStepIndex ? "w-8 bg-primary" : "w-4 bg-muted"
                    )}
                  />
                ))}
              </div>
            )}

            {step === 'welcome' && (
              <div className="text-center space-y-4 animate-in fade-in duration-500">
                <h1 className="text-3xl font-bold text-primary">Good Morning!</h1>
                <p className="text-lg text-muted-foreground">
                  Let&apos;s plan your day.
                </p>
                <div className="pt-4">
                  <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                </div>
              </div>
            )}

            {step === 'carryover' && (
              <CarryoverStep
                tasks={incompleteTasks}
                onKeep={handleKeepTask}
                onDismiss={onDismissTask}
                onEdit={onEditTask}
                onContinue={handleCarryoverContinue}
              />
            )}

            {step === 'top-three' && (
              <TopThreeSelection
                tasks={availableTasks}
                selectedIds={selectedTopThree}
                onToggleSelect={handleToggleSelect}
                onAddTask={handleAddTask}
                onContinue={handleTopThreeContinue}
              />
            )}

            {step === 'confirmation' && (
              <PlanningConfirmation
                topThreeTasks={topThreeTasks}
                onComplete={handleComplete}
              />
            )}
          </div>
        </div>
      </div>

      {step !== 'welcome' && step !== 'confirmation' && (
        <div className="p-4 border-t bg-background/80 backdrop-blur">
          <Button
            variant="ghost"
            onClick={onSkip}
            className="w-full text-muted-foreground"
          >
            Skip Planning
          </Button>
        </div>
      )}
    </div>
  );
}
