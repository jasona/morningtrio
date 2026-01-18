'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Task, TaskSection, TaskListType } from '@/types/task';
import { generateId, getTodayString } from '@/lib/utils';
import { useAuth } from './useAuth';

export function useTasks(activeTaskList: TaskListType = 'personal') {
  const { userId, isAuthenticated, isLoading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const tasksRef = useRef<Task[]>([]);

  // Keep ref in sync with state
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const today = getTodayString();

  // Filter tasks by active task list first
  const listTasks = tasks.filter((t) => t.taskList === activeTaskList);

  // Keep mustDo tasks that are either incomplete OR completed today
  const mustDoTasks = listTasks.filter((t) => t.section === 'mustDo' && (!t.completed || t.completedDate === today));
  const otherTasks = listTasks.filter((t) => t.section === 'other' && !t.completed);
  // Completed section: completed "other" tasks + mustDo tasks completed on previous days
  const completedTasks = listTasks.filter((t) =>
    t.completed && (t.section === 'other' || (t.section === 'mustDo' && t.completedDate !== today))
  );

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

  const addTask = useCallback(async (text: string, section: TaskSection = 'other'): Promise<Task> => {
    if (!userId) {
      throw new Error('User must be authenticated to add tasks');
    }

    const newTask: Task = {
      id: generateId(),
      userId,
      text,
      completed: false,
      section,
      taskList: activeTaskList,
      orderIndex: 0, // Will be set by server or recalculated
      createdDate: getTodayString(),
      completedDate: null,
    };

    // Optimistic update
    setTasks((prev) => {
      const sectionTasks = prev.filter((t) => t.section === section && t.taskList === activeTaskList);
      const maxOrder = sectionTasks.length > 0
        ? Math.max(...sectionTasks.map((t) => t.orderIndex))
        : -1;
      return [...prev, { ...newTask, orderIndex: maxOrder + 1 }];
    });

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
  }, [userId, activeTaskList]);

  const updateTask = useCallback(async (id: string, updates: Partial<Omit<Task, 'id' | 'userId'>>): Promise<void> => {
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
        // Revert by re-fetching (since we don't have previousTasks in callback scope)
        console.error('Failed to update task:', response.status);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<void> => {
    // Optimistic update
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.error('Failed to delete task:', response.status);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }, []);

  const toggleComplete = useCallback(async (id: string): Promise<void> => {
    // Get current completed state from ref before updating
    const task = tasksRef.current.find((t) => t.id === id);
    if (!task) return;
    const newCompleted = !task.completed;
    const newCompletedDate = newCompleted ? getTodayString() : null;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: newCompleted, completedDate: newCompletedDate } : t))
    );

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: newCompleted, completedDate: newCompletedDate }),
      });

      if (!response.ok) {
        console.error('Failed to toggle task:', response.status);
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  }, []);

  const moveToSection = useCallback(async (id: string, newSection: TaskSection): Promise<void> => {
    setTasks((prev) => {
      const targetTasks = prev.filter((t) => t.section === newSection && t.taskList === activeTaskList);
      const maxOrder = targetTasks.length > 0
        ? Math.max(...targetTasks.map((t) => t.orderIndex))
        : -1;
      return prev.map((t) =>
        t.id === id ? { ...t, section: newSection, orderIndex: maxOrder + 1 } : t
      );
    });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: newSection }),
      });

      if (!response.ok) {
        console.error('Failed to move task:', response.status);
      }
    } catch (error) {
      console.error('Error moving task:', error);
    }
  }, [activeTaskList]);

  const reorderTasks = useCallback(async (section: TaskSection, orderedIds: string[]): Promise<void> => {
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
    }
  }, []);

  const clearCompleted = useCallback(async (): Promise<void> => {
    let completedTaskIds: string[] = [];

    // Optimistic update and capture IDs - only clear completed tasks in active list
    setTasks((prev) => {
      completedTaskIds = prev.filter((t) => t.completed && t.taskList === activeTaskList).map((t) => t.id);
      return prev.filter((t) => !(t.completed && t.taskList === activeTaskList));
    });

    try {
      await Promise.all(
        completedTaskIds.map((id) =>
          fetch(`/api/tasks/${id}`, { method: 'DELETE' })
        )
      );
    } catch (error) {
      console.error('Error clearing completed tasks:', error);
    }
  }, [activeTaskList]);

  const getIncompleteTasks = useCallback((): Task[] => {
    return tasks.filter((t) => !t.completed && t.taskList === activeTaskList);
  }, [tasks, activeTaskList]);

  return {
    tasks,
    mustDoTasks,
    otherTasks,
    completedTasks,
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
