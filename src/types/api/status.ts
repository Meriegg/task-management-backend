import { Status } from '../index';

export interface CreateStatusBody {
  title: string;
  boardId: string;
}

export interface CreateStatusReturnType {
  newStatus: Status;
}

export interface GetStatusesReturnType {
  statuses: Status[];
}

export interface DeleteStatusReturnType {
  deletedStatus: Status;
}
