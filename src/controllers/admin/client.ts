import express from 'express';
import DBAdapter from '../../adapters/DBAdapter';
import ResponseLib from '../../libs/Response.Lib';
import { Job } from '../../db/entities/Job.entity';
import { IRequestQuery } from '../../interfaces/requests/request.interface';
import UtilsService from '../../services/Utils.Service';

export const getAllClients = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { order_by, status, page, limit }: IRequestQuery = req.query;
    const db = new DBAdapter();
    const skip = (Number(page) - 1) * Number(limit);
    const sort_by = order_by === 'newest' ? 'DESC' : 'ASC'
    const status_filter = status ? `AND u.status=${status}` : ''

    const total = await db.raw(`SELECT COUNT(*) AS total FROM users WHERE role = 'client' `);

    const clients = await db.raw(`
        SELECT
            u.id,
            u.first_name,
            u.last_name,
            u.email,
            u.phone,
            u.status,
            u.created_on,
            COUNT(DISTINCT j.id) AS total_jobs_posted,
            COALESCE(
              ( 
                SELECT json_agg(review_obj)
                FROM (
                  SELECT DISTINCT ON (rs.id)
                  json_build_object(
                          'id', rs.id,
                          'description', rs.description,
                          'rating', rs.rating,
                          'create_on', rs.created_on,
                          'job_id', j.id,
                          'title', j.title,
                          'first_name', g.first_name,
                          'last_name', g.last_name
                ) as review_obj FROM reviews rs
                LEFT JOIN jobs j on rs.job_id = j.id
                WHERE rs.client_id = u.id
                ) AS subquery
                ),
          '[]'::json
            ) AS client_reviews
        FROM users u
        LEFT JOIN jobs j ON u.id = j.client_id
        LEFT JOIN reviews r ON u.id = r.client_id
        LEFT JOIN users g ON g.id = r.guard_id
        WHERE u.role = 'client' AND u.deleted_flag=FALSE ${status_filter}
        GROUP BY u.id, g.id
        ORDER BY u.created_on ${sort_by}
        LIMIT ${limit} OFFSET ${skip};
    `)

    return new ResponseLib(req, res).json({
      success: true, 
      message: 'License status updated.',
      data: clients,
      meta: UtilsService.paginate(req.query, { items: clients, total: Number(total[0].total)})
    })
    
  } catch (error) {
    next(error)
  }
}
