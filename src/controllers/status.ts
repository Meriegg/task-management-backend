import prisma from '../utils/prisma';
import handleError from '../utils/handleError';
import { Request } from 'express';
import {
  TypedResponse,
  CreateStatusBody,
  CreateStatusReturnType,
  GetStatusesReturnType,
  DeleteStatusReturnType
} from '../types';

export const createStatus = async (req: Request, res: TypedResponse<CreateStatusReturnType>) => {
  try {
    const userId = res.locals.userId;
    const body: CreateStatusBody = req.body;

    const newStatus = await prisma.status.create({
      data: {
        title: body.title,
        boardId: body.boardId,
        ownerId: userId
      },
      include: {
        board: true,
        owner: true,
        tasks: true
      }
    });

    res.status(200).json({
      error: false,
      errorMessage: null,
      data: {
        newStatus
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getStatuses = async (_: Request, res: TypedResponse<GetStatusesReturnType>) => {
  try {
    const userId = res.locals.userId;

    const statuses = await prisma.status.findMany({
      where: {
        ownerId: userId
      },
      include: {
        board: true,
        owner: true,
        tasks: true
      }
    });
    if (!statuses) {
      return res.status(404).json({
        error: true,
        errorMessage: 'Could not get statuses',
        data: null
      });
    }

    res.status(200).json({
      error: false,
      errorMessage: null,
      data: {
        statuses
      }
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const editStatus = async (req: Request, res: TypedResponse<CreateStatusReturnType>) => {
  try {
    const statusId = req.params.id;
    if (!statusId) {
      return res.status(404).json({
        error: true,
        errorMessage: 'Unable to find status!',
        data: null
      });
    }

    const body: CreateStatusBody = req.body;
    const newStatus = await prisma.status.update({
      where: {
        id: statusId
      },
      data: {
        title: body.title,
        boardId: body.boardId
      },
      include: {
        board: true,
        owner: true,
        tasks: true
      }
    });

    res.status(200).json({
      error: false,
      errorMessage: null,
      data: {
        newStatus
      }
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const deleteStatus = async (req: Request, res: TypedResponse<DeleteStatusReturnType>) => {
  try {
    const statusId = req.params.id;
    if (!statusId) {
      return res.status(404).json({
        error: true,
        errorMessage: 'Unable to find status!',
        data: null
      });
    }

    const deletedStatus = await prisma.status.delete({
      where: {
        id: statusId
      },
      include: {
        board: true,
        owner: true,
        tasks: true
      }
    });

    res.status(200).json({
      error: false,
      errorMessage: null,
      data: {
        deletedStatus
      }
    });
  } catch (error) {
    return handleError(res, error);
  }
};
