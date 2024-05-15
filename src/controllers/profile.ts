import express from 'express';
import ResponseLib from '../libs/Response.Lib';
import DBAdapter from '../adapters/DBAdapter';
import { User } from '../db/entities/User.entity';
import { BadRequest } from '../libs/Error.Lib';
import UserMapper from '../mappers/User.Mapper';
import { IRequestQuery } from '../interfaces/requests/request.interface';
import { QueryBuilder  } from 'typeorm';
import { ClientDataSource } from '../db/datasource.config';


export const me = async (req: express.Request, res: express.Response, next: express.NextFunction) => { 
  try {
    const user = req.user; 
    const userData = await ClientDataSource.query(`
    SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.phone,
    u.country_code,
    u.status,
    u.role,
    m.url AS profile_image
    FROM 
        users u
    LEFT JOIN 
        (SELECT user_id, url FROM media_files WHERE object_key = 'profile_pic') m 
        ON u.id = m.user_id
    WHERE 
        u.id = $1
      `, [user.id]);
    if (userData.length === 0 ) throw new BadRequest('User not found.');
    const userDocumentQuery = await ClientDataSource.query(`
      SELECT url AS document_url, doc_type, direction
      FROM documents 
      WHERE user_id = $1
      `, [user.id])
      userData[0].documents = userDocumentQuery || []
    return new ResponseLib(req, res).json({ 
      success: true,
      message: "Profile fetched successfully.",
      data: userData[0]
    })
    
  } catch (error) {
    next(error)
  }
}
/* 
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
 */
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