export type TaskSection = 'mustDo' | 'other';

export interface Task {
  id: string;
  userId: string;
  text: string;
  completed: boolean;
  section: TaskSection;
  orderIndex: number;
  createdDate: string;
}

export interface AppState {
  currentDate: string;
  lastPlanningDate: string | null;
  isPlanningComplete: boolean;
}
