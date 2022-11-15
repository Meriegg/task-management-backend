import prisma from '../utils/prisma';
import handleError from '../utils/handleError';
import { Request } from 'express';
import {
  CreateBoardReturnType,
  CreateBoardBody,
  GetBoardsReturnType,
  DeleteBoardReturnType
} from '../types/api/boards';
import { TypedResponse } from '../types';

export const createBoard = async (req: Request, res: TypedResponse<CreateBoardReturnType>) => {
  try {
    const userId = res.locals.userId;
    const body: CreateBoardBody = req.body;

    const newBoard = await prisma.board.create({
      data: {
        ownerId: userId,
        name: body.name
      },
      include: {
        owner: true,
        statuses: true
      }
    });

    res.status(200).json({
      error: false,
      errorMessage: null,
      data: {
        newBoard
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const editBoard = async (req: Request, res: TypedResponse<CreateBoardReturnType>) => {
  try {
    const boardId = req.params.id;
    if (!boardId) {
      res.status(404).json({
        error: true,
        errorMessage: 'Unable to find board!',
        data: null
      });
      return;
    }

    const body: CreateBoardBody = req.body;
    const newBoard = await prisma.board.update({
      where: {
        id: boardId
      },
      data: {
        name: body.name
      },
      include: {
        owner: true,
        statuses: {
          include: {
            tasks: true
          }
        }
      }
    });

    res.status(200).json({
      error: false,
      errorMessage: null,
      data: {
        newBoard
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getBoards = async (_: Request, res: TypedResponse<GetBoardsReturnType>) => {
  try {
    const userId = res.locals.userId;

    const boards = await prisma.board.findMany({
      where: {
        ownerId: userId
      },
      include: {
        owner: true,
        statuses: {
          include: {
            tasks: true
          }
        }
      }
    });
    if (!boards) {
      return res.status(200).json({
        error: true,
        errorMessage: "You don't have any boards yet!",
        data: null
      });
    }

    return res.status(200).json({
      error: false,
      errorMessage: null,
      data: {
        boards
      }
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const deleteBoard = async (req: Request, res: TypedResponse<DeleteBoardReturnType>) => {
  try {
    const boardId = req.params.id;
    const deletedBoard = await prisma.board.delete({
      where: {
        id: boardId
      }
    });

    res.status(200).json({
      error: false,
      errorMessage: null,
      data: {
        deletedBoard
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};
