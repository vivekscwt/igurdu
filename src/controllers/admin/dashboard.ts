import express from 'express';
import DBAdapter from '../../adapters/DBAdapter';
import ResponseLib from '../../libs/Response.Lib';


export const adminDashboard = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const db = new DBAdapter();
    const result = await db.raw(`
    SELECT
      (SELECT COUNT(*) FROM jobs WHERE deleted_flag=FALSE) AS total_jobs_posted,
      (SELECT COUNT(*) FROM jobs WHERE status = 'open' AND deleted_flag=FALSE) AS total_open_jobs,
      (SELECT COUNT(*) FROM jobs WHERE status = 'filled' AND deleted_flag=FALSE) AS total_filled_jobs,
      (SELECT COUNT(*) FROM users WHERE deleted_flag=FALSE) AS total_users,
      (SELECT COUNT(*) FROM users WHERE role = 'guard' AND deleted_flag=FALSE) AS total_guards,
      (SELECT COUNT(*) FROM users WHERE role = 'guard' AND status = 'pending' AND deleted_flag=FALSE) AS total_unverified_guards,
      (SELECT COUNT(*) FROM users WHERE role = 'guard' AND status = 'recommended' AND deleted_flag=FALSE) AS total_recommended_guards,
      (SELECT COUNT(*) FROM users WHERE role = 'guard' AND status != 'pending' AND deleted_flag=FALSE) AS total_verified_guards,
      (SELECT COUNT(*) FROM jobs WHERE status = 'open' AND deleted_flag=FALSE) AS total_active_jobs,
      (SELECT COUNT(*) FROM reviews WHERE deleted_flag=FALSE) AS total_reviews,
      (SELECT COUNT(DISTINCT job_id) FROM applications WHERE deleted_flag=FALSE) AS total_applications;
  `)
  
  return new ResponseLib(req, res).json({
    success: true,
    message: "Dashboard data fetched.",
    data: result[0] ?? {}
  })
  } catch (error) {
    next(error)
  }
}


export const dashboardCharts = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const db = new DBAdapter();
    const [totalUsers, totalApplications, totalJobs] = await Promise.all([
      db.raw(`
        SELECT
            DATE_TRUNC('month', "created_on") AS month,
            SUM(CASE WHEN role = 'guard' AND deleted_flag=FALSE THEN 1 ELSE 0 END) AS guards,
            SUM(CASE WHEN role = 'client' AND deleted_flag=FALSE THEN 1 ELSE 0 END) AS clients
        FROM
            users
        GROUP BY
            DATE_TRUNC('month', "created_on")
        ORDER BY
            DATE_TRUNC('month', "created_on");
      `),
      db.raw(`
        SELECT
            DATE_TRUNC('month', "created_on") AS month,
            SUM(CASE WHEN status = 'hired' AND deleted_flag=FALSE THEN 1 ELSE 0 END) AS total_hired,
            COUNT(*) AS total_applications
        FROM
            applications
        WHERE
            job_id IN (SELECT id FROM jobs WHERE deleted_flag = false)
        GROUP BY
            DATE_TRUNC('month', "created_on")
        ORDER BY
            DATE_TRUNC('month', "created_on");
      `),
      db.raw(`
        SELECT
            DATE_TRUNC('month', "created_on") AS month,
            COUNT(*) AS total_jobs
        FROM
            jobs
        WHERE
            deleted_flag = false
        GROUP BY
            DATE_TRUNC('month', "created_on")
        ORDER BY
            DATE_TRUNC('month', "created_on");
      `)
    ]);

  return new ResponseLib(req, res).json({
    success: true,
    message: "Dashboard data fetched.",
    data: {
      allUsers: totalUsers ?? [],
      jobChart: totalApplications.concat(totalJobs)
    }
  })
  } catch (error) {
    next(error)
  }
}