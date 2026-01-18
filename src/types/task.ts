export type TaskSection = 'mustDo' | 'other';
export type TaskListType = 'work' | 'personal';

export interface Task {
  id: string;
  userId: string;
  text: string;
  completed: boolean;
  section: TaskSection;
  taskList: TaskListType;
  orderIndex: number;
  createdDate: string;
  completedDate: string | null;
}

export interface TaskListPlanningState {
  lastPlanningDate: string | null;
  isPlanningComplete: boolean;
}

export interface AppState {
  currentDate: string;
  activeTaskList: TaskListType;
  planningState: {
    work: TaskListPlanningState;
    personal: TaskListPlanningState;
  };
}
