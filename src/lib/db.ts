import Dexie, { type EntityTable } from 'dexie';
import type { Task } from '@/types/task';

const db = new Dexie('MorningTrioDB') as Dexie & {
  tasks: EntityTable<Task, 'id'>;
};

// Version 1: Original schema
db.version(1).stores({
  tasks: 'id, section, orderIndex, createdDate',
});

// Version 2: Add userId for multi-user support
db.version(2)
  .stores({
    tasks: 'id, userId, section, orderIndex, createdDate, [userId+section], [userId+createdDate]',
  })
  .upgrade((tx) => {
    // Migrate existing tasks: assign to 'local' user (will be claimed on first login)
    return tx
      .table('tasks')
      .toCollection()
      .modify((task) => {
        if (!task.userId) {
          task.userId = 'local';
        }
      });
  });

export { db };
