import { db } from '@/lib/db';
import type { Task } from '@/types/task';

beforeEach(async () => {
  await db.tasks.clear();
});

afterAll(async () => {
  await db.delete();
});

describe('db.tasks operations', () => {
  it('adds a task to the database', async () => {
    const task: Task = {
      id: 'test-1',
      text: 'Test task',
      completed: false,
      section: 'other',
      orderIndex: 0,
      createdDate: '2026-01-15',
    };

    await db.tasks.add(task);
    const retrieved = await db.tasks.get('test-1');

    expect(retrieved).toEqual(task);
  });

  it('updates a task', async () => {
    const task: Task = {
      id: 'test-2',
      text: 'Original text',
      completed: false,
      section: 'other',
      orderIndex: 0,
      createdDate: '2026-01-15',
    };

    await db.tasks.add(task);
    await db.tasks.update('test-2', { text: 'Updated text', completed: true });

    const updated = await db.tasks.get('test-2');
    expect(updated?.text).toBe('Updated text');
    expect(updated?.completed).toBe(true);
  });

  it('deletes a task', async () => {
    const task: Task = {
      id: 'test-3',
      text: 'To be deleted',
      completed: false,
      section: 'other',
      orderIndex: 0,
      createdDate: '2026-01-15',
    };

    await db.tasks.add(task);
    await db.tasks.delete('test-3');

    const deleted = await db.tasks.get('test-3');
    expect(deleted).toBeUndefined();
  });

  it('toggles task completion', async () => {
    const task: Task = {
      id: 'test-4',
      text: 'Toggle test',
      completed: false,
      section: 'mustDo',
      orderIndex: 0,
      createdDate: '2026-01-15',
    };

    await db.tasks.add(task);
    
    const original = await db.tasks.get('test-4');
    expect(original?.completed).toBe(false);

    await db.tasks.update('test-4', { completed: !original?.completed });
    
    const toggled = await db.tasks.get('test-4');
    expect(toggled?.completed).toBe(true);
  });

  it('filters tasks by section', async () => {
    await db.tasks.bulkAdd([
      { id: '1', text: 'Must Do 1', completed: false, section: 'mustDo', orderIndex: 0, createdDate: '2026-01-15' },
      { id: '2', text: 'Must Do 2', completed: false, section: 'mustDo', orderIndex: 1, createdDate: '2026-01-15' },
      { id: '3', text: 'Other 1', completed: false, section: 'other', orderIndex: 0, createdDate: '2026-01-15' },
    ]);

    const mustDoTasks = await db.tasks.where('section').equals('mustDo').toArray();
    const otherTasks = await db.tasks.where('section').equals('other').toArray();

    expect(mustDoTasks).toHaveLength(2);
    expect(otherTasks).toHaveLength(1);
  });

  it('orders tasks by orderIndex', async () => {
    await db.tasks.bulkAdd([
      { id: '1', text: 'Third', completed: false, section: 'other', orderIndex: 2, createdDate: '2026-01-15' },
      { id: '2', text: 'First', completed: false, section: 'other', orderIndex: 0, createdDate: '2026-01-15' },
      { id: '3', text: 'Second', completed: false, section: 'other', orderIndex: 1, createdDate: '2026-01-15' },
    ]);

    const ordered = await db.tasks.orderBy('orderIndex').toArray();

    expect(ordered[0].text).toBe('First');
    expect(ordered[1].text).toBe('Second');
    expect(ordered[2].text).toBe('Third');
  });
});
