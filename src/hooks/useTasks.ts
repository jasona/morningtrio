'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Task, TaskSection } from '@/types/task';
import { generateId, getTodayString } from '@/lib/utils';
import { useAuth } from './useAuth';

export function useTasks() {
  const { userId, isAuthenticated, isLoading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const mustDoTasks = tasks.filter((t) => t.section === 'mustDo');
  const otherTasks = tasks.filter((t) => t.section === 'other');

  // Fetch tasks from server
  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated || !userId) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, userId]);

  // Fetch tasks when authenticated
  useEffect(() => {
    if (!authLoading) {
      fetchTasks();
    }
  }, [authLoading, fetchTasks]);

  async function addTask(text: string, section: TaskSection = 'other'): Promise<Task> {
    if (!userId) {
      throw new Error('User must be authenticated to add tasks');
    }

    const sectionTasks = section === 'mustDo' ? mustDoTasks : otherTasks;
    const maxOrder = sectionTasks.length > 0
      ? Math.max(...sectionTasks.map((t) => t.orderIndex))
      : -1;

    const newTask: Task = {
      id: generateId(),
      userId,
      text,
      completed: false,
      section,
      orderIndex: maxOrder + 1,
      createdDate: getTodayString(),
    };

    // Optimistic update
    setTasks((prev) => [...prev, newTask]);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        // Revert on error
        setTasks((prev) => prev.filter((t) => t.id !== newTask.id));
        throw new Error('Failed to create task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      setTasks((prev) => prev.filter((t) => t.id !== newTask.id));
      throw error;
    }

    return newTask;
  }

  async function updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'userId'>>): Promise<void> {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        // Revert by refetching
        fetchTasks();
        throw new Error('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      fetchTasks();
    }
  }

  async function deleteTask(id: string): Promise<void> {
    const taskToDelete = tasks.find((t) => t.id === id);

    // Optimistic update
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        // Revert on error
        if (taskToDelete) {
          setTasks((prev) => [...prev, taskToDelete]);
        }
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      if (taskToDelete) {
        setTasks((prev) => [...prev, taskToDelete]);
      }
    }
  }

  async function toggleComplete(id: string): Promise<void> {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      await updateTask(id, { completed: !task.completed });
    }
  }

  async function moveToSection(id: string, newSection: TaskSection): Promise<void> {
    const targetTasks = newSection === 'mustDo' ? mustDoTasks : otherTasks;
    const maxOrder = targetTasks.length > 0
      ? Math.max(...targetTasks.map((t) => t.orderIndex))
      : -1;

    await updateTask(id, { section: newSection, orderIndex: maxOrder + 1 });
  }

  async function reorderTasks(section: TaskSection, orderedIds: string[]): Promise<void> {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => {
        const index = orderedIds.indexOf(t.id);
        if (index !== -1) {
          return { ...t, orderIndex: index };
        }
        return t;
      })
    );

    // Update each task on server
    try {
      await Promise.all(
        orderedIds.map((id, index) =>
          fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderIndex: index }),
          })
        )
      );
    } catch (error) {
      console.error('Error reordering tasks:', error);
      fetchTasks();
    }
  }

  async function clearCompleted(): Promise<void> {
    const completedTasks = tasks.filter((t) => t.completed);

    // Optimistic update
    setTasks((prev) => prev.filter((t) => !t.completed));

    try {
      await Promise.all(
        completedTasks.map((task) =>
          fetch(`/api/tasks/${task.id}`, { method: 'DELETE' })
        )
      );
    } catch (error) {
      console.error('Error clearing completed tasks:', error);
      fetchTasks();
    }
  }

  async function getIncompleteTasks(): Promise<Task[]> {
    return tasks.filter((t) => !t.completed);
  }

  return {
    tasks,
    mustDoTasks,
    otherTasks,
    isLoading: isLoading || authLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    moveToSection,
    reorderTasks,
    clearCompleted,
    getIncompleteTasks,
    refreshTasks: fetchTasks,
  };
}
