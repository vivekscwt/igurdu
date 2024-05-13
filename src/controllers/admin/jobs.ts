import express from 'express';
import DBAdapter from '../../adapters/DBAdapter';
import ResponseLib from '../../libs/Response.Lib';
import { Job } from '../../db/entities/Job.entity';
import { IRequestQuery } from '../../interfaces/requests/request.interface';
import UtilsService from '../../services/Utils.Service';

export const getAllJobs = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { budget, created_at, page, limit }: IRequestQuery = req.query;
    const db = new DBAdapter();
    const skip = (Number(page) - 1) * Number(limit);

    const [jobs, total] = await db.findAndCount(Job, {
      where: { meta: { deleted_flag: false }},
      relations: {
        user: true
      },
      skip,
      take: limit,
      order: {
        budget: budget==='high'?'DESC':'ASC',
        meta: { created_on : created_at==='high'?'DESC':'ASC' }
      }
    })

    return new ResponseLib(req, res).json({
      success: true, 
      message: 'Jobs fetched!',
      data: jobs,
      meta: UtilsService.paginate(req.query, { items: jobs, total })
    })
    
  } catch (error) {
    next(error)
  }
}

export const updateJobStatus = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const db = new DBAdapter();

    const job = await db.updateAndFetch(Job, { id: Number(id) }, {
      status
    })

    return new ResponseLib(req, res).json({
      success: true, 
      message: 'Job status updated.',
      data: job
    })
    
  } catch (error) {
    next(error)
  }
}
