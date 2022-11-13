export * from './api/index';
export * from './api/auth';
export * from './api/boards';
export * from './api/status';
export * from './api/task';

export interface User {
  id: string;
  email: string;
  password: string;
  boardsId: string[];
  boards?: Board[];
  statusListIds: string[];
  statusList?: Status[];
  tasksId: string[];
  tasks?: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  subtasks: string[];
  statusId: string;
  ownerId: string;
  status?: Status;
  owner?: User;
}

export interface Board {
  id: string;
  name: string;
  ownerId: string;
  statusIds: string[];
  owner?: User;
  statuses?: Status[];
}

export interface Status {
  id: string;
  title: string;
  ownerId: string;
  tasksId: string[];
  boardId: string;
  owner?: User;
  tasks?: Task[];
  board?: Board;
}
