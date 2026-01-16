import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// POST /api/tasks/sync - Sync tasks from client to server
// This handles bulk operations for offline sync
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tasks } = body;

    if (!Array.isArray(tasks)) {
      return NextResponse.json({ error: 'Tasks must be an array' }, { status: 400 });
    }

    const userId = session.user.id;

    // Process each task - upsert to handle both new and existing tasks
    const results = await Promise.all(
      tasks.map(async (task: {
        id: string;
        text: string;
        completed?: boolean;
        section?: string;
        orderIndex?: number;
        createdDate?: string;
        deleted?: boolean;
      }) => {
        try {
          if (task.deleted) {
            // Delete the task if marked as deleted
            await prisma.task.deleteMany({
              where: { id: task.id, userId },
            });
            return { id: task.id, action: 'deleted' };
          }

          // Upsert the task
          const upsertedTask = await prisma.task.upsert({
            where: { id: task.id },
            update: {
              text: task.text,
              completed: task.completed ?? false,
              section: task.section ?? 'other',
              orderIndex: task.orderIndex ?? 0,
              createdDate: task.createdDate ?? new Date().toISOString().split('T')[0],
            },
            create: {
              id: task.id,
              userId,
              text: task.text,
              completed: task.completed ?? false,
              section: task.section ?? 'other',
              orderIndex: task.orderIndex ?? 0,
              createdDate: task.createdDate ?? new Date().toISOString().split('T')[0],
            },
          });
          return { id: upsertedTask.id, action: 'synced' };
        } catch (error) {
          console.error(`Error syncing task ${task.id}:`, error);
          return { id: task.id, action: 'error' };
        }
      })
    );

    // Return all server tasks after sync
    const serverTasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { orderIndex: 'asc' },
    });

    return NextResponse.json({ results, tasks: serverTasks });
  } catch (error) {
    console.error('Error syncing tasks:', error);
    return NextResponse.json({ error: 'Failed to sync tasks' }, { status: 500 });
  }
}
