'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import type { Task, TaskSection } from '@/types/task';
import { generateId, getTodayString } from '@/lib/utils';

export function useTasks() {
  const tasks = useLiveQuery(() => db.tasks.orderBy('orderIndex').toArray(), []);

  const mustDoTasks = tasks?.filter((t) => t.section === 'mustDo') ?? [];
  const otherTasks = tasks?.filter((t) => t.section === 'other') ?? [];

  async function addTask(text: string, section: TaskSection = 'other'): Promise<Task> {
    const sectionTasks = section === 'mustDo' ? mustDoTasks : otherTasks;
    const maxOrder = sectionTasks.length > 0
      ? Math.max(...sectionTasks.map((t) => t.orderIndex))
      : -1;

    const newTask: Task = {
      id: generateId(),
      text,
      completed: false,
      section,
      orderIndex: maxOrder + 1,
      createdDate: getTodayString(),
    };

    await db.tasks.add(newTask);
    return newTask;
  }

  async function updateTask(id: string, updates: Partial<Omit<Task, 'id'>>): Promise<void> {
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
    return db.tasks.filter((t) => !t.completed).toArray();
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
  };
}
