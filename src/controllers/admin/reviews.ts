import express from 'express';
import DBAdapter from '../../adapters/DBAdapter';
import ResponseLib from '../../libs/Response.Lib';
import { Job } from '../../db/entities/Job.entity';
import { IRequestQuery } from '../../interfaces/requests/request.interface';
import UtilsService from '../../services/Utils.Service';
import { Review } from '../../db/entities/Review.entity';

export const getAllReviews = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {

    const { page, limit }: IRequestQuery = req.query;
    const db = new DBAdapter();
    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await db.findAndCount(Review, {
      where: { meta: { deleted_flag: false }},
      relations: {
        client: true,
        job: true,
        guard: true
      },
      skip,
      take: limit
    })

    return new ResponseLib(req, res).json({
      success: true, 
      message: 'Reviews fetched!',
      data: reviews,
      meta: UtilsService.paginate(req.query, { items: reviews, total })
    })
    
  } catch (error) {
    next(error)
  }
}

export const deleteReview = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { id } = req.params;
    const db = new DBAdapter();
    
    
    await db.update(Review, { id: Number(id) }, {
      meta: { deleted_flag: true }
    })

    return new ResponseLib(req, res).json({
      success: true, 
      message: 'Review deleted.',
      data: null
    })
    
  } catch (error) {
    next(error)
  }
}