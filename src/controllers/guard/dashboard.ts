import express from 'express';
import DBAdapter from '../../adapters/DBAdapter';
import { Applications } from '../../db/entities/Application.entity';
import ResponseLib from '../../libs/Response.Lib';
// stats / recent applications

export const guardDashboard = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const user = req.user;
    const db = new DBAdapter();
    const query = `
      SELECT status AS type, COALESCE(COUNT(*), 0) AS total_count
      FROM applications a
      WHERE a.guard_id = ${user.id} and a.deleted_flag = false
      GROUP BY a.status
      
      UNION
      
      SELECT 'reviews' AS type, COUNT(*) AS total_count
      FROM reviews
      WHERE guard_id =  ${user.id}
    `

    const totalQuery = `
      SELECT 
          'applied' AS type,
          COUNT(DISTINCT job_id) AS total_count
      FROM
          applications
      WHERE 
          guard_id = 1 AND 
          deleted_flag = false;
    `

    const [status, total, mostRecentJobs] = await Promise.all([
      db.raw(query),
      db.raw(totalQuery),
      db.find(Applications, {
        where: {
          guard_id: user.id,
          meta: { deleted_flag: false }
        },
        relations: { job: true },
        take: 3,
        order: { meta:{ created_on: 'DESC' }}
      })
    ])

    const format = (data: any) => {
      return data.map((d: any) => ({
        [d.type]: d.total_count
      }));
    };
    
    function flattenList(data: any) {
      const flattenedObject = {};
      for (const item of data) {
        Object.assign(flattenedObject, item);
      }
      return flattenedObject;
    }

    return new ResponseLib(req, res).json({
      success: true,
      data: {
        myJobsData: {
          ...flattenList(format(status)),
          ...flattenList(format(total)),
        },
        mostRecentJobs
      }
    })
    
  } catch (error) {
      next(error)
  }
}