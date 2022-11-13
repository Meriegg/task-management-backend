import { Task } from '../index';

export interface CreateTaskBody {
  title: string;
  description: string;
  statusId: string;
  subtasks?: string[];
}

export interface CreateTaskReturnType {
  newTask: Task;
}
