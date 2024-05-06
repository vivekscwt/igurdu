import express from 'express';
import {
  IAuthLoginRequest,
} from '../interfaces/requests/auth.request.interface';

import ErrorLib, { BadRequest, NotFound } from '../libs/Error.Lib';
import ResponseLib from '../libs/Response.Lib';
import UserMapper from '../mappers/User.Mapper';
import AuthService from '../services/Auth.Service';
import { STATUSES } from '../config';
import EmailService from '../services/Email.Service';
import LoggerLib from '../libs/Logger.Lib';
import DBAdapter from '../adapters/DBAdapter';
import { User } from '../db/entities/User.entity';

export const login = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const body: IAuthLoginRequest = req.body;
    const auth = new AuthService();
    const user = await auth.findUserByEmail(body.email);
    await auth.validateUserPassword(body.password, user.password);
    if (user.status !== STATUSES.ACTIVE) {
      throw new ErrorLib(`Cannot login, account is ${user.status}.`, 400)
    }
    const token = await auth.generateUserToken(user, '1d', 'verify');

    const data = {
      subject: "Login successful.",
      html: `Hello ${user.first_name}, <br /> You have just logged into your Igarudu account.`
    }
    await new EmailService(user).send(data)
    // .catch(LoggerLib.error);

    return new ResponseLib(req, res)
      .setHeader({ 'access-token': token }).json({
        success: true,
        message: 'Successfully logged in',
        ...UserMapper.toDTO(user),
        token
      });
  } catch (error) {
    if (error instanceof NotFound || error instanceof BadRequest) {
      return next(new BadRequest('Incorrect username or password'))
    }
    next(error)
  }
}
export const register = async  (req: express.Request, res: express.Response, next: express.NextFunction) => { 
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      password,
      role,
    } = req.body;
    const auth = new AuthService()
    email && await auth.canRegisterUserByEmail(email)
    const user = await auth.registerUser({ first_name, last_name, email, phone, password, role})
    const token = await auth.generateUserToken(user, '3d')
    new EmailService(user).send('{ token }').catch(LoggerLib.error);

    return new ResponseLib(req, res).status(201).json({
      status: true,
      message: 'A verification link has been sent to your email.',
    })
  } catch (error) {
    next(error)
  }
}

// resend link,

export const resendLink = async  (req: express.Request, res: express.Response, next: express.NextFunction) => { 
  try {
    const user = req.user;
    const auth = new AuthService()
    const token = await auth.generateUserToken(user, '3d')
    new EmailService(user).send('{ token }').catch(LoggerLib.error);

    return new ResponseLib(req, res).status(201).json({
      status: true,
      message: 'A verification link has been resent to your email.',
    })
  } catch (error) {
    next(error)
  }
}

export const getResetPasswordLink = async  (req: express.Request, res: express.Response, next: express.NextFunction) => { 
  try {
    const { email } = req.body;
    const auth = new AuthService()
    const user = await auth.findUserByEmail(email).catch(LoggerLib.error);

    if (user) {
      const token = await auth.generateUserToken(user, '3d')
      new EmailService(user).send('{ token }').catch(LoggerLib.error);
    }

    return new ResponseLib(req, res).status(201).json({
      status: true,
      message: 'A verification link has been resent to your email.',
    })
  } catch (error) {
    next(error)
  }
}

// reset password
export const resetPassword = async  (req: express.Request, res: express.Response, next: express.NextFunction) => { 
  try {
    const user = req.user;
    const auth = new AuthService()
    const { password } = req.body;
    const hashPassword = await auth.hashPassword(password);
    const updated = await new DBAdapter().updateAndFetch(User, { email: user.email }, {
      password: hashPassword
    });

    const token = await auth.generateUserToken(user, '3d')

    return new ResponseLib(req, res).json({
      status: true,
      message: 'Password updated successfully.',
      data: {
        token,
        user: UserMapper.toDTO(updated)
      }
    })
  } catch (error) {
    next(error)
  }
}

//

export const changePassword = async  (req: express.Request, res: express.Response, next: express.NextFunction) => { 
  try {
    const user = req.user;
    const auth = new AuthService()
    const { oldPassword, password } = req.body;
    const foundUser = await auth.findUserByEmail(user.email);
    const oldHash = await auth.hashPassword(oldPassword);
    await auth.validateUserPassword(oldHash, foundUser.password)

    const hashPassword = await auth.hashPassword(password);
    const updated = await new DBAdapter().updateAndFetch(User, { email: user.email }, {
      password: hashPassword
    });

    return new ResponseLib(req, res).json({
      status: true,
      message: 'Password updated successfully.',
      data: UserMapper.toDTO(updated)
    })
  } catch (error) {
    next(error)
  }
}


export const verifyUser = async  (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const user = req.user;
    const db = new DBAdapter();
    await db.updateAndFetch(User, { id: user.id }, { status: STATUSES.ACTIVE })

    return new ResponseLib(req, res).json({
      success: true
    })
    
  } catch (error) {
    next(error)
  }
}