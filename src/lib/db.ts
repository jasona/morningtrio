import Dexie, { type EntityTable } from 'dexie';
import type { Task } from '@/types/task';

const db = new Dexie('MorningTrioDB') as Dexie & {
  tasks: EntityTable<Task, 'id'>;
};

db.version(1).stores({
  tasks: 'id, section, orderIndex, createdDate',
});

export { db };
