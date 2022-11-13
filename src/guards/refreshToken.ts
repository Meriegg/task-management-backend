import prisma from '../utils/prisma';
import argon from 'argon2';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TypedResponse } from '../types';
import { NextFunction, Request } from 'express';

export default async (req: Request, res: TypedResponse<null>, next: NextFunction) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      res.status(500).json({
        error: true,
        errorMessage: 'Something wrong happened on our end!',
        data: null
      }).locals.userId = null;
      return;
    }

    const token = req.cookies['refreshToken'];
    if (!token) {
      res.status(401).json({
        error: true,
        errorMessage: 'Invalid refresh token!',
        data: null
      }).locals.userId = null;
      return;
    }

    const decoded: JwtPayload | string = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === 'string' || !decoded.sub || !decoded.exp) {
      res.status(401).json({
        error: true,
        errorMessage: 'Invalid refresh token!',
        data: null
      }).locals.userId = null;
      return;
    }

    const userId = decoded.sub;

    if (Date.now() >= decoded.exp * 1000) {
      res.status(401).json({
        error: true,
        errorMessage: 'Invalid refresh token!',
        data: null
      }).locals.userId = null;
      return;
    }

    if (!decoded.isRefresh) {
      res.status(401).json({
        error: true,
        errorMessage: 'Invalid refresh token!',
        data: null
      }).locals.userId = null;
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });
    if (!existingUser?.refreshToken) {
      res.status(401).json({
        error: true,
        errorMessage: 'Unathorized to perform this operation!',
        data: null
      }).locals.userId = null;
      return;
    }

    const doTokensMatch = await argon.verify(existingUser.refreshToken, token, { saltLength: 16 });
    if (!doTokensMatch) {
      res.status(401).json({
        error: true,
        errorMessage: 'You are not authorized to access this data!',
        data: null
      }).locals.userId = null;
      return;
    }

    res.locals.userId = userId;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      error: true,
      errorMessage: 'Invalid refresh token!',
      data: null
    });
  }
};
