import express from 'express';
import ResponseLib from '../../libs/Response.Lib';
import DBAdapter from '../../adapters/DBAdapter';
import { IRequestQuery } from '../../interfaces/requests/request.interface';
import { Job } from '../../db/entities/Job.entity';
import UtilsService from '../../services/Utils.Service';

// list
export const listJobs = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const user = req.user;
    const db = new DBAdapter();
    const { budget, created_at, page, limit }: IRequestQuery  = req.query
    const skip = (Number(page) - 1) * Number(limit);

    const [jobs, total] = await db.findAndCount(Job, {
      where: {
        client_id: user.id,
      },
      skip,
      take: limit,
      order: {
        budget: budget === 'highest' ? 'ASC' : 'DESC',
        meta: { created_on: created_at === 'newest' ? 'ASC' : 'DESC' }
      }
    })

    return new ResponseLib(req, res).json({
      success: true,
      message: "Jobs fetched successfully.",
      data: jobs,
      meta: UtilsService.paginate(req.query, {items: jobs, total })
    })
  } catch (error) {
    next(error)
  }
}

// find guards
export const findGuards = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const user = req.user;
    const db = new DBAdapter();
    const { id } = req.params;

    const query = `
      SELECT DISTINCT ON (u.id)
          u.id as guard_id,
          j.id AS job_id,
          u.email,
          u.first_name,
          u.last_name,
          u.role,
          u.description as guard_description,
          l.lat AS guard_location_lat,
          l.lng AS guard_location_lng,
          l.address,
          COALESCE(
            (
                SELECT json_agg(
                    json_build_object(
                        'id', lcs.id,
                        'role', lcs.role,
                        'trades', lcs.trades,
                        'sia_number', lcs.sia_number,
                        'expiry_date_from', lcs.expiry_date_from,
                        'expiry_date_to', lcs.expiry_date_to,
                        'sector', lcs.sector,
                        'status', lcs.status
                    )
                ) 
                FROM licenses lcs 
                WHERE lcs.guard_id = u.id AND lcs.status != 'unverified'
            ), '[]'::json
        ) AS licenses,
        COALESCE(
            (
                SELECT json_agg(
                    json_build_object(
                        'review_id', r.id,
                        'review_description', r.description,
                        'review_rating', r.rating
                    )
                )
                FROM reviews r
                WHERE r.guard_id = u.id
            ), '[]'::json
        ) AS reviews,
          COALESCE((
              SELECT AVG(rating) FROM reviews WHERE guard_id = u.id
          ), 0) AS average_rating,
          j.*,
              (acos(
                  sin(radians(CAST(l.lat AS double precision))) * sin(radians(CAST(j.lat AS double precision))) +
                  cos(radians(CAST(l.lat AS double precision))) * cos(radians(CAST(j.lat AS double precision))) * 
                  cos(radians(CAST(l.lng AS double precision) - CAST(j.lng AS double precision)))
              ) * 6371) AS distance_to_job
          FROM jobs j
          INNER JOIN users u ON u.role = 'guard'
          INNER JOIN json_array_elements_text(j."lookingFor") AS job_trade ON true
          INNER JOIN profiles p ON p.user_id = u.id
          INNER JOIN locations l ON p.location_id = l.id
          INNER JOIN licenses lcs ON p.user_id = lcs.guard_id AND lcs.status != 'unverified'
          INNER JOIN json_array_elements_text(lcs.trades) AS license_trade ON job_trade = license_trade
      WHERE j.status = 'open'
      AND j.id =${id}
      AND j.deleted_flag = false
      AND j.client_id = ${user.id}
      AND u.status != 'pending'
      AND (
          acos(
              sin(radians(CAST(l.lat AS double precision))) * sin(radians(CAST(j.lat AS double precision))) +
              cos(radians(CAST(l.lat AS double precision))) * cos(radians(CAST(j.lat AS double precision))) * 
              cos(radians(CAST(l.lng AS double precision) - CAST(j.lng AS double precision)))
          ) * 6371 <= l.max_distance OR l.max_distance IS NULL
      )
      AND NOT EXISTS (
          SELECT 1
          FROM applications a
          WHERE a.job_id = j.id
          AND a.guard_id = u.id
          AND a.deleted_flag = false
      )
      GROUP BY j.id, u.id, l.id, lcs.id
      ORDER BY u.id, distance_to_job;
    `
    const result = await db.raw(query);

    return new ResponseLib(req, res).json({
      success: true,
      message: "Successfully fetched guards.",
      data: result
    })
  } catch (error) {
    next()
  }
}
