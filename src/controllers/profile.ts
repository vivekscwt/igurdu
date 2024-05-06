import express from 'express';
import ResponseLib from '../libs/Response.Lib';
import DBAdapter from '../adapters/DBAdapter';
import { User } from '../db/entities/User.entity';
import { BadRequest } from '../libs/Error.Lib';
import UserMapper from '../mappers/User.Mapper';
import { IRequestQuery } from '../interfaces/requests/request.interface';

export const me = async (req: express.Request, res: express.Response, next: express.NextFunction) => { 
  try {
    const user = req.user;
    const profile = await new DBAdapter().findOne(User, {
      where: {
        id: user.id,
        meta: { deleted_flag: false }
      }
    })
    if (!profile) throw new BadRequest('User not found.');

    return new ResponseLib(req, res).json({ 
      success: true,
      message: "Profile fetched successfully.",
      data: UserMapper.toDTO(profile)
    })
  } catch (error) {
    next(error)
  }
}

export const updateAccountStatus = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const db = new DBAdapter();

    const user = await db.updateAndFetch(User, {
      id: Number(id),
      meta: { deleted_flag: false}
    }, { status })

    return new ResponseLib(req, res).json({
      success: true, 
      message: 'User status updated.',
      data: user
    })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { id } = req.params;
    const db = new DBAdapter();

    await db.update(User, {
      id: Number(id),
      meta: { deleted_flag: false}
    }, { meta: { deleted_flag: true } })

    return new ResponseLib(req, res).json({
      success: true, 
      message: 'User deleted',
      data: null
    })
  } catch (error) {
    next(error)
  }
}