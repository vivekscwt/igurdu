import express from 'express';
import ResponseLib from '../../libs/Response.Lib';
import DBAdapter from '../../adapters/DBAdapter';

// job/ application aggregates
export const clientDashboard = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const user = req.user;
    const user_id = user.id;
    const db = new DBAdapter();

    const result = await db.raw(`
      SELECT
        (
          SELECT COUNT(*) FROM jobs j
          INNER JOIN users u ON j.client_id = u.id
          WHERE u.id = ${user_id}  AND j.deleted_flag = false
        ) AS total_jobs,
        (
          SELECT COUNT(*) FROM jobs j
          INNER JOIN users u ON j.client_id = u.id
          WHERE u.id =  ${user_id} AND j.status = 'open' AND j.deleted_flag = false
        ) AS open_jobs,
        (
          SELECT COUNT(*) FROM jobs j
          INNER JOIN users u ON j.client_id = u.id
          WHERE u.id =  ${user_id} AND j.status = 'suspended'  AND j.deleted_flag = false
        ) AS suspended_jobs,
        (
          SELECT COUNT(*) 
          FROM applications WHERE job_id IN (
            SELECT j.id FROM jobs j INNER JOIN users u ON j.client_id = u.id WHERE u.id =  ${user_id}
          )  AND deleted_flag = false
        )
      AS total_applications;
    `)

    return new ResponseLib(req, res).json({
      success: true,
      message: "Dashboard data loaded successfully.",
      data: result[0] ?? {}
    })
    
  } catch (error) {
    next(error)
  }
}

// charts
export const dashboardCharts = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const user = req.user;
    const user_id = user.id;
    const db = new DBAdapter();

    const [applications, jobs] = await Promise.all([
        db.raw(`
          WITH applications AS (
            SELECT ja.*,
                  EXTRACT(YEAR FROM ja.created_on) AS year,
                  TO_CHAR(ja.created_on, 'mm-YYYY') AS month_name
            FROM applications ja
            INNER JOIN jobs j ON ja.job_id = j.id
            WHERE j.client_id = ${user_id} AND ja.deleted_flag = false
          )
          SELECT
            month_name AS month,
            SUM(CASE WHEN ja.status = 'hired' THEN 1 ELSE 0 END) AS total_hired,
            COUNT(*) AS total_applications
          FROM applications ja
          WHERE ja.deleted_flag = false
          GROUP BY year, month_name
          ORDER BY year ASC, month_name ASC;
      `),
      db.raw(`
        WITH user_jobs AS (
          SELECT j.*,
                EXTRACT(YEAR FROM j.created_on) AS year,
                TO_CHAR(j.created_on, 'YYYY/mm/dd') AS month_name  -- Assuming PostgreSQL
          FROM jobs j
          WHERE j.client_Id = ${user_id} AND j.deleted_flag = false
        )
        SELECT
          month_name AS month,
          COUNT(*) AS total_jobs
        FROM user_jobs
        GROUP BY year, month_name
        ORDER BY year ASC, month_name ASC;
      `)
    ])

    return new ResponseLib(req, res).json({
      success: true,
      message: "Dashboard data loaded successfully.",
      data: {
        jobs,
        applications
      }
    })
    
  } catch (error) {
    next(error)
  }
}