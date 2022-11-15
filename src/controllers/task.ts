import handleError from '../utils/handleError';
import prisma from '../utils/prisma';
import { Request } from 'express';
import {
  CreateTaskBody,
  CreateTaskReturnType,
  DeleteTaskReturnType,
  EditTaskReturnType,
  GetTasksReturnType,
  TypedResponse
} from 'src/types';

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

export const getTasks = async (_: Request, res: TypedResponse<GetTasksReturnType>) => {
  try {
    const userId = res.locals.userId;

    const tasks = await prisma.task.findMany({
      where: {
        ownerId: userId
      },
      include: {
        owner: true,
        status: true
      }
    });
    if (!tasks) {
      return res.status(404).json({
        error: true,
        errorMessage: 'Could not find any tasks',
        data: null
      });
    }

    res.status(200).json({
      error: false,
      errorMessage: null,
      data: {
        tasks
      }
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const deleteTask = async (req: Request, res: TypedResponse<DeleteTaskReturnType>) => {
  try {
    const taskId = req.params.id;
    const deletedTask = await prisma.task.delete({
      where: {
        id: taskId
      },
      include: {
        owner: true,
        status: true
      }
    });

    res.status(200).json({
      error: false,
      errorMessage: null,
      data: {
        deletedTask
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const editTask = async (req: Request, res: TypedResponse<EditTaskReturnType>) => {
  try {
    const body: CreateTaskBody = req.body;
    const taskId = req.params.id;
    const userId = res.locals.userId;

    const editedTask = await prisma.task.update({
      where: {
        id: taskId
      },
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
        editedTask
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};
