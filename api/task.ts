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

export interface GetTasksReturnType {
  tasks: Task[];
}

export interface DeleteTaskReturnType {
  deletedTask: Task;
}

export interface EditTaskReturnType {
  editedTask: Task;
}
