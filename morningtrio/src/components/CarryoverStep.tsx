'use client';

import { useState } from 'react';
import type { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CarryoverStepProps {
  tasks: Task[];
  onKeep: (id: string) => void;
  onDismiss: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onContinue: () => void;
}

export function CarryoverStep({
  tasks,
  onKeep,
  onDismiss,
  onEdit,
  onContinue,
}: CarryoverStepProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [decisions, setDecisions] = useState<Record<string, 'keep' | 'dismiss'>>({});

  const handleStartEdit = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const handleSaveEdit = (id: string) => {
    if (editText.trim()) {
      onEdit(id, editText.trim());
      setDecisions((prev) => ({ ...prev, [id]: 'keep' }));
    }
    setEditingId(null);
    setEditText('');
  };

  const handleKeep = (id: string) => {
    onKeep(id);
    setDecisions((prev) => ({ ...prev, [id]: 'keep' }));
  };

  const handleDismiss = (id: string) => {
    onDismiss(id);
    setDecisions((prev) => ({ ...prev, [id]: 'dismiss' }));
  };

  const allDecided = tasks.every((t) => decisions[t.id]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Unfinished Tasks</h2>
        <p className="text-sm text-muted-foreground">
          You have {tasks.length} task{tasks.length !== 1 ? 's' : ''} from yesterday.
          Decide what to do with each one.
        </p>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              "p-4 rounded-xl border transition-all",
              decisions[task.id] === 'keep' && "border-primary/50 bg-primary/5",
              decisions[task.id] === 'dismiss' && "border-muted bg-muted/50 opacity-60"
            )}
          >
            {editingId === task.id ? (
              <div className="flex gap-2">
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(task.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                />
                <Button size="sm" onClick={() => handleSaveEdit(task.id)}>
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className={cn(
                  "flex-1 text-sm",
                  decisions[task.id] === 'dismiss' && "line-through"
                )}>
                  {task.text}
                </span>
                
                {!decisions[task.id] && (
                  <div className="flex gap-1">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => handleStartEdit(task)}
                      aria-label="Edit task"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => handleKeep(task.id)}
                      className="text-primary hover:text-primary"
                      aria-label="Keep task"
                    >
                      <Check className="size-4" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => handleDismiss(task.id)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Dismiss task"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                )}

                {decisions[task.id] && (
                  <span className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    decisions[task.id] === 'keep' && "bg-primary/10 text-primary",
                    decisions[task.id] === 'dismiss' && "bg-muted text-muted-foreground"
                  )}>
                    {decisions[task.id] === 'keep' ? 'Keeping' : 'Dismissed'}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <Button
        onClick={onContinue}
        disabled={!allDecided}
        className="w-full"
        size="lg"
      >
        {allDecided ? 'Continue' : `Decide on ${tasks.length - Object.keys(decisions).length} more`}
      </Button>
    </div>
  );
}
