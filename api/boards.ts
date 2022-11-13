import { Board } from '@prisma/client';

export interface CreateBoardReturnType {
  newBoard: Board;
}

export interface CreateBoardBody {
  name: string;
}

export interface GetBoardsReturnType {
  boards: Board[];
}

export interface DeleteBoardReturnType {
  deletedBoard: Board;
}
