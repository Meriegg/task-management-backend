import handleError from '../utils/handleError';
import prisma from '../utils/prisma';
import { Request } from 'express';
import { CreateTaskBody, CreateTaskReturnType, TypedResponse } from 'src/types';

export const createTask = async (req: Request, res: TypedResponse<CreateTaskReturnType>) => {
  try {
    const body: CreateTaskBody = req.body;
    const userId = res.locals.userId;

    const newTask = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        ownerId: userId,
        subtasks: body.subtasks ? body.subtasks : [],
        statusId: body.statusId
      }
    });

    res.status(200).json({
      error: false,
      errorMessage: null,
      data: {
        newTask
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};
