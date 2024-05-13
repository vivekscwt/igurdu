import express from 'express';
import ResponseLib from '../../libs/Response.Lib';
import DBAdapter from '../../adapters/DBAdapter';
import { User } from '../../db/entities/User.entity';
import { BadRequest } from '../../libs/Error.Lib';
import bcrypt from 'bcrypt';
import { STATUSES, USER_ROLES } from '../../config';
import { Job } from '../../db/entities/Job.entity';
import { Applications } from '../../db/entities/Application.entity';
import { Review } from '../../db/entities/Review.entity';
import { IRequestQuery } from '../../interfaces/requests/request.interface';
import { Utils } from 'handlebars';
import UtilsService from '../../services/Utils.Service';

// write reviews
export const writeReviews = async (req: express.Request, res: express.Response, next: express.NextFunction) => { 
  try {
    const user = req.user;
    const { guard_id, job_id, rating, title, description, work_completed_at } = req.body;
    const db = new DBAdapter();

    const application = await db.findOne(Applications, { where: {
      job_id: Number(job_id),
      guard_id: Number(guard_id),
      meta: { deleted_flag: false }
    }})
    if (!application) throw new BadRequest('Application not found.')

    const foundReview = await db.findOne(Review, { 
      where: {
        job_id: Number(job_id),
        guard_id: Number(guard_id),
        client_id: user.id,
        meta: { deleted_flag: false }
      }
    })

    let review;

    if (foundReview) {
      review = await db.updateAndFetch(Review, {
        job_id: Number(job_id),
        guard_id: Number(guard_id),
        client_id: user.id,
        meta: { deleted_flag: false }
      }, {
        title,
        description,
        rating,
        work_completed_at,
      });
    } else {

      review = await db.insertAndFetch(Review, {
        title,
        description,
        rating,
        work_completed_at,
        job_id: Number(job_id),
        guard_id: Number(guard_id),
        client_id: user.id
      });
    }

    return new ResponseLib(req, res).json({
      success: true,
      message: "Review submitted successfully.",
      data: review
    })
  } catch (error) {
    next(error)
  }
}

// get reviews

export const listReviews = async (req: express.Request, res: express.Response, next: express.NextFunction) => { 
  try {
    const user = req.user;
    const { page, limit }: IRequestQuery = req.query;
    const db = new DBAdapter();
    const skip = (Number(page) - 1) * Number(limit);

    const [review, total] = await db.findAndCount(Review, {
      where: {
        client_id: user.id,
        meta: { deleted_flag: false }
      },
      relations: { 
        guard: true,
        client: true,
        job: true,
      },
      skip,
      take: limit
    });

    return new ResponseLib(req, res).json({
      success: true,
      message: "Review submitted successfully.",
      data: review,
      meta: UtilsService.paginate(req.query, { items: review, total })
    })
  } catch (error) {
    next(error)
  }
}