'use client';

import { useState, type KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TaskInputProps {
  onAddTask: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function TaskInput({ onAddTask, placeholder = "Add a task...", disabled = false }: TaskInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (trimmed) {
      onAddTask(trimmed);
      setText('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 h-11 rounded-xl"
        aria-label="New task text"
      />
      <Button
        onClick={handleSubmit}
        disabled={disabled || !text.trim()}
        size="icon"
        className="h-11 w-11 shrink-0"
        aria-label="Add task"
      >
        <Plus className="size-5" />
      </Button>
    </div>
  );
}
