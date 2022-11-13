import jwt, { JwtPayload } from 'jsonwebtoken';
import { TypedResponse } from '../types';
import { NextFunction, Request } from 'express';

export default (req: Request, res: TypedResponse<null>, next: NextFunction) => {
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

    const token = req.headers['authorization']?.split('Bearer ')[1];
    if (!token) {
      res.status(401).json({
        error: true,
        errorMessage: 'You are unauthorized!',
        data: null
      }).locals.userId = null;
      return;
    }

    const decoded: JwtPayload | string = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === 'string' || !decoded.sub || !decoded.exp) {
      res.status(401).json({
        error: true,
        errorMessage: 'You are unauthorized!',
        data: null
      }).locals.userId = null;
      return;
    }

    if (Date.now() >= decoded.exp * 1000) {
      res.status(401).json({
        error: true,
        errorMessage: 'You are unauthorized!',
        data: null
      }).locals.userId = null;
      return;
    }

    if (typeof decoded.isRefresh === undefined || decoded.isRefresh === true) {
      res.status(401).json({
        error: true,
        errorMessage: 'Invalid token!',
        data: null
      }).locals.userId = null;
      return;
    }

    res.locals.userId = decoded.sub;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      error: true,
      errorMessage: 'You are unauthorized!',
      data: null
    }).locals.userId = null;
  }
};
