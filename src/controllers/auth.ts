import prisma from '../utils/prisma';
import jwt from 'jsonwebtoken';
import argon from 'argon2';
import handleError from '../utils/handleError';
import { randomBytes } from 'crypto';
import { Request } from 'express';
import {
  TypedResponse,
  AuthReturnType,
  AuthBody,
  RefreshTokenReturnType,
  GetUserDataReturnType
} from '../types';

const createAuthToken = (userId: string): string | null => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return null;
  }

  const authToken = jwt.sign({ sub: userId, isRefresh: false }, JWT_SECRET, { expiresIn: '1h' });
  return authToken;
};

const createRefreshToken = async (userId: string): Promise<string | null> => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return null;
    }

    const refreshToken = jwt.sign({ sub: userId, isRefresh: true }, JWT_SECRET, { expiresIn: '7d' });

    const hashedRefreshToken = await argon.hash(refreshToken, { saltLength: 16, salt: randomBytes(16) });
    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        refreshToken: hashedRefreshToken
      }
    });

    return refreshToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const register = async (req: Request, res: TypedResponse<AuthReturnType>) => {
  try {
    const body: AuthBody = req.body;
    if (!body.email.trim() || !body.password.trim()) {
      res.status(400).json({
        error: true,
        errorMessage: 'Email or password not valid!',
        data: null
      });
      return;
    }

    const hashedPass = await argon.hash(body.password, { saltLength: 16, salt: randomBytes(16) });
    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPass
      },
      include: {
        boards: true,
        statusList: true,
        tasks: true
      }
    });

    const authToken = createAuthToken(newUser.id);
    const refreshToken = await createRefreshToken(newUser.id);
    if (!authToken || !refreshToken) {
      res.status(400).json({
        error: true,
        errorMessage: 'There was a problem authenticating you :(',
        data: null
      });
      return;
    }

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      path: '/',
      secure: process.env.NODE_ENV === 'development' ? false : true
    });

    res.status(200).json({
      error: false,
      errorMessage: null,
      data: {
        user: newUser,
        authToken,
        refreshToken
      }
    });
  } catch (e) {
    handleError(res, e);
  }
};

export const login = async (req: Request, res: TypedResponse<AuthReturnType>) => {
  try {
    const body: AuthBody = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email
      },
      include: {
        boards: true,
        statusList: true,
        tasks: true
      }
    });
    if (!existingUser) {
      res.status(404).json({
        error: true,
        errorMessage: 'User does not exist!',
        data: null
      });
      return;
    }

    const isCorrectPass = await argon.verify(existingUser.password, body.password, { saltLength: 16 });
    if (!isCorrectPass) {
      res.status(401).json({
        error: true,
        errorMessage: 'Password may be incorrect!',
        data: null
      });
      return;
    }

    const authToken = createAuthToken(existingUser.id);
    const refreshToken = await createRefreshToken(existingUser.id);
    if (!authToken || !refreshToken) {
      res.status(400).json({
        error: true,
        errorMessage: 'There was a problem authenticating you :(',
        data: null
      });
      return;
    }

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      path: '/',
      secure: process.env.NODE_ENV === 'development' ? false : true
    });

    res.status(200).json({
      error: false,
      errorMessage: null,
      data: {
        user: existingUser,
        authToken,
        refreshToken
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const refreshToken = async (_: Request, res: TypedResponse<RefreshTokenReturnType>) => {
  try {
    const userId: string = res.locals.userId; // Protected by guard

    const newAuthToken = createAuthToken(userId);
    const newRefreshToken = await createRefreshToken(userId);
    if (!newAuthToken || !newRefreshToken) {
      res.status(401).json({
        error: true,
        errorMessage: "Oops, we can't authenticate you :(",
        data: null
      });
      return;
    }

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      sameSite: 'none',
      path: '/',
      secure: process.env.NODE_ENV === 'development' ? false : true
    });

    res.status(200).json({
      error: false,
      errorMessage: null,
      data: {
        newAuthToken,
        newRefreshToken
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getUserData = async (_: Request, res: TypedResponse<GetUserDataReturnType>) => {
  try {
    const userId = res.locals.userId;

    const userData = await prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        boards: true,
        statusList: true,
        tasks: true
      }
    });
    if (!userData) {
      res.status(404).json({
        error: true,
        errorMessage: 'Could not get user data!',
        data: null
      });
      return;
    }

    res.status(200).json({
      error: false,
      errorMessage: null,
      data: {
        userData
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};
