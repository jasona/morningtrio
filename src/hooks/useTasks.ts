'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import type { Task, TaskSection } from '@/types/task';
import { generateId, getTodayString } from '@/lib/utils';
import { useAuth } from './useAuth';

export function useTasks() {
  const { userId } = useAuth();

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

    await db.tasks.add(newTask);
    return newTask;
  }

  async function updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'userId'>>): Promise<void> {
    await db.tasks.update(id, updates);
  }

  async function deleteTask(id: string): Promise<void> {
    await db.tasks.delete(id);
  }

  async function toggleComplete(id: string): Promise<void> {
    const task = await db.tasks.get(id);
    if (task) {
      await db.tasks.update(id, { completed: !task.completed });
    }
  }

  async function moveToSection(id: string, newSection: TaskSection): Promise<void> {
    const targetTasks = newSection === 'mustDo' ? mustDoTasks : otherTasks;
    const maxOrder = targetTasks.length > 0
      ? Math.max(...targetTasks.map((t) => t.orderIndex))
      : -1;

    await db.tasks.update(id, { section: newSection, orderIndex: maxOrder + 1 });
  }

  async function reorderTasks(section: TaskSection, orderedIds: string[]): Promise<void> {
    await db.transaction('rw', db.tasks, async () => {
      for (let i = 0; i < orderedIds.length; i++) {
        await db.tasks.update(orderedIds[i], { orderIndex: i });
      }
    });
  }

  async function clearCompleted(): Promise<void> {
    const completedIds = tasks?.filter((t) => t.completed).map((t) => t.id) ?? [];
    await db.tasks.bulkDelete(completedIds);
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
    await db.transaction('rw', db.tasks, async () => {
      const localTasks = await db.tasks
        .where('userId')
        .equals('local')
        .toArray();

      for (const task of localTasks) {
        await db.tasks.update(task.id, { userId });
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
  };
}
