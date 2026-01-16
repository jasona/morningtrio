'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import type { Task, TaskSection } from '@/types/task';
import { generateId, getTodayString } from '@/lib/utils';
import { useAuth } from './useAuth';

export function useTasks() {
  const { userId, isAuthenticated } = useAuth();
  const hasSyncedRef = useRef(false);
  const syncInProgressRef = useRef(false);

  // Local IndexedDB query
  const tasks = useLiveQuery(
    () => {
      if (!userId) return [];
      return db.tasks
        .where('userId')
        .equals(userId)
        .sortBy('orderIndex');
    },
    [userId]
  );

  const mustDoTasks = tasks?.filter((t) => t.section === 'mustDo') ?? [];
  const otherTasks = tasks?.filter((t) => t.section === 'other') ?? [];

  // Sync tasks from server to local IndexedDB
  const syncFromServer = useCallback(async () => {
    if (!userId || !isAuthenticated || syncInProgressRef.current) return;

    syncInProgressRef.current = true;
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        if (response.status === 401) return; // Not authenticated
        throw new Error('Failed to fetch tasks');
      }

      const serverTasks: Task[] = await response.json();

      // Update local IndexedDB with server data
      await db.transaction('rw', db.tasks, async () => {
        // Get current local tasks for this user
        const localTasks = await db.tasks
          .where('userId')
          .equals(userId)
          .toArray();

        const serverTaskIds = new Set(serverTasks.map(t => t.id));
        const localTaskIds = new Set(localTasks.map(t => t.id));

        // Delete local tasks that don't exist on server
        const toDelete = localTasks.filter(t => !serverTaskIds.has(t.id));
        await db.tasks.bulkDelete(toDelete.map(t => t.id));

        // Upsert server tasks to local
        for (const task of serverTasks) {
          await db.tasks.put({ ...task, userId });
        }
      });
    } catch (error) {
      console.error('Error syncing from server:', error);
    } finally {
      syncInProgressRef.current = false;
    }
  }, [userId, isAuthenticated]);

  // Initial sync when authenticated
  useEffect(() => {
    if (isAuthenticated && userId && !hasSyncedRef.current) {
      hasSyncedRef.current = true;
      syncFromServer();
    }
  }, [isAuthenticated, userId, syncFromServer]);

  // Reset sync flag when user changes
  useEffect(() => {
    hasSyncedRef.current = false;
  }, [userId]);

  // Helper to sync a single task to server
  const syncTaskToServer = async (task: Task) => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });

      if (!response.ok && response.status !== 409) {
        // 409 means task already exists, try update instead
        await fetch(`/api/tasks/${task.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task),
        });
      }
    } catch (error) {
      console.error('Error syncing task to server:', error);
    }
  };

  // Helper to update task on server
  const updateTaskOnServer = async (id: string, updates: Partial<Task>) => {
    if (!isAuthenticated) return;

    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (error) {
      console.error('Error updating task on server:', error);
    }
  };

  // Helper to delete task from server
  const deleteTaskFromServer = async (id: string) => {
    if (!isAuthenticated) return;

    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting task from server:', error);
    }
  };

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

    // Add to local IndexedDB immediately
    await db.tasks.add(newTask);

    // Sync to server in background
    syncTaskToServer(newTask);

    return newTask;
  }

  async function updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'userId'>>): Promise<void> {
    // Update local immediately
    await db.tasks.update(id, updates);

    // Sync to server in background
    updateTaskOnServer(id, updates);
  }

  async function deleteTask(id: string): Promise<void> {
    // Delete from local immediately
    await db.tasks.delete(id);

    // Delete from server in background
    deleteTaskFromServer(id);
  }

  async function toggleComplete(id: string): Promise<void> {
    const task = await db.tasks.get(id);
    if (task) {
      const updates = { completed: !task.completed };
      await db.tasks.update(id, updates);
      updateTaskOnServer(id, updates);
    }
  }

  async function moveToSection(id: string, newSection: TaskSection): Promise<void> {
    const targetTasks = newSection === 'mustDo' ? mustDoTasks : otherTasks;
    const maxOrder = targetTasks.length > 0
      ? Math.max(...targetTasks.map((t) => t.orderIndex))
      : -1;

    const updates = { section: newSection, orderIndex: maxOrder + 1 };
    await db.tasks.update(id, updates);
    updateTaskOnServer(id, updates);
  }

  async function reorderTasks(section: TaskSection, orderedIds: string[]): Promise<void> {
    await db.transaction('rw', db.tasks, async () => {
      for (let i = 0; i < orderedIds.length; i++) {
        await db.tasks.update(orderedIds[i], { orderIndex: i });
        // Sync each update to server
        updateTaskOnServer(orderedIds[i], { orderIndex: i });
      }
    });
  }

  async function clearCompleted(): Promise<void> {
    const completedTasks = tasks?.filter((t) => t.completed) ?? [];

    // Delete from local
    await db.tasks.bulkDelete(completedTasks.map((t) => t.id));

    // Delete from server
    for (const task of completedTasks) {
      deleteTaskFromServer(task.id);
    }
  }

  async function getIncompleteTasks(): Promise<Task[]> {
    if (!userId) return [];
    return db.tasks
      .where('userId')
      .equals(userId)
      .filter((t) => !t.completed)
      .toArray();
  }

  // Check if there are unclaimed local tasks (for migration modal)
  async function getLocalTasks(): Promise<Task[]> {
    return db.tasks
      .where('userId')
      .equals('local')
      .toArray();
  }

  // Claim local tasks for the current user
  async function claimLocalTasks(): Promise<void> {
    if (!userId) return;

    const localTasks = await db.tasks
      .where('userId')
      .equals('local')
      .toArray();

    await db.transaction('rw', db.tasks, async () => {
      for (const task of localTasks) {
        const updatedTask = { ...task, userId };
        await db.tasks.update(task.id, { userId });
        // Sync to server
        syncTaskToServer(updatedTask);
      }
    });
  }

  // Clear all local tasks without claiming
  async function clearLocalTasks(): Promise<void> {
    const localTasks = await db.tasks
      .where('userId')
      .equals('local')
      .toArray();

    await db.tasks.bulkDelete(localTasks.map((t) => t.id));
  }

  // Manual refresh from server
  const refreshFromServer = useCallback(() => {
    hasSyncedRef.current = false;
    return syncFromServer();
  }, [syncFromServer]);

  return {
    tasks: tasks ?? [],
    mustDoTasks,
    otherTasks,
    isLoading: tasks === undefined,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    moveToSection,
    reorderTasks,
    clearCompleted,
    getIncompleteTasks,
    getLocalTasks,
    claimLocalTasks,
    clearLocalTasks,
    refreshFromServer,
  };
}
