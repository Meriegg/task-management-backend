import type { Response } from 'express';

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

export interface AuthBody {
  email: string;
  password: string;
}

export interface RefreshTokenReturnType {
  newRefreshToken: string;
  newAuthToken: string;
}

export interface AuthReturnType {
  user: User;
  authToken: string;
  refreshToken: string;
}

export interface ControllerReturnType<T> {
  error: boolean;
  errorMessage: string | null;
  data: T | null;
}

export type TypedResponse<T> = Response<ControllerReturnType<T>>;
