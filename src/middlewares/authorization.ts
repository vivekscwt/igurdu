import express from 'express';
import jwt from 'jsonwebtoken';
import { IJWTPayload } from '../interfaces/requests/auth.request.interface';
import ErrorLib, { NotFound } from '../libs/Error.Lib';
import AuthService from '../services/Auth.Service';
import { USER_ROLES } from '../config';

export const authorizeRequest = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    if (req.headers.authorization?.split(' ')[0].toLowerCase() !== 'bearer') throw new ErrorLib('unauthorized', 401, 'Bear not present')
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) throw new ErrorLib('unauthorized', 401, 'Token not found.')
    const { i: id, scope } = jwt.verify(token, process.env.JWT_TOKEN) as IJWTPayload
    const auth = new AuthService();
    const user = await auth.findUserById(id);
    req.user = user;
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof NotFound) {
      next(new ErrorLib('unauthorized', 401, error.message))
    } else {
      next(error)
    }
  }
}


export const passAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    if (req.headers.authorization) {
      if (req.headers.authorization?.split(' ')[0].toLowerCase() !== 'bearer') throw new ErrorLib('unauthorized', 401, 'Bear not present')
      const token = req.headers.authorization?.split(' ')[1]
      if (!token) throw new ErrorLib('unauthorized', 401, 'Token not found.')
      const { i: id, scope } = jwt.verify(token, process.env.JWT_TOKEN) as IJWTPayload
      const auth = new AuthService();
      const user = await auth.findUserById(id);
      req.user = user;
    }
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof NotFound) {
      next(new ErrorLib('unauthorized', 401, error.message))
    } else {
      next(error)
    }
  }
}

export const authorizeGuard = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    if (req.user.role === USER_ROLES.GUARD ) return next()
    throw new ErrorLib('forbidden', 403)
  } catch (error) {
    next(error)
  }
}


export const authorizeClient = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    if (req.user.role === USER_ROLES.CLIENT ) return next()
    throw new ErrorLib('forbidden', 403)
  } catch (error) {
    next(error)
  }
}


export const authorizeAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    if (req.user.role === USER_ROLES.ADMIN ) return next()
    throw new ErrorLib('forbidden', 403)
  } catch (error) {
    next(error)
  }
}