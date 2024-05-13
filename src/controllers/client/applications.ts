import express, { query } from 'express';
import DBAdapter from '../../adapters/DBAdapter';
import ResponseLib from '../../libs/Response.Lib';
import { Job } from '../../db/entities/Job.entity';
import { BadRequest } from '../../libs/Error.Lib';
import { Applications } from '../../db/entities/Application.entity';
import { APPLICATION_STATUS, STATUSES } from '../../config';
import { IRequestQuery } from '../../interfaces/requests/request.interface';
import UtilsService from '../../services/Utils.Service';
import EmailService from '../../services/Email.Service';
import { User } from '../../db/entities/User.entity';
import LoggerLib from '../../libs/Logger.Lib';

// invite to job
export const inviteToApply =  async (req: express.Request, res: express.Response, next: express.NextFunction) => { 
  try {
    const user = req.user;
    const { job_id, guard_id } = req.body;
    const db = new DBAdapter();
    const job = await db.findOne(Job, { where: { id: job_id, client_id: user.id,  status: STATUSES.OPEN, meta: { deleted_flag: false } }})
    const guard = await db.findOne(User, { where: { id: guard_id, meta: { deleted_flag: false }  }});

    if (!guard)  throw new BadRequest('Guard not found.');
    if (!job) throw new BadRequest('Job not found.');
    if (Number(job.quantity) < 1) throw new BadRequest("You cannot invite to this job, it is already filled out.")

    const isAppliedFor = await db.findOne(Applications, {
      where: {
        guard_id,
        job_id,
        meta: { deleted_flag: false }
      }
    });

    if (isAppliedFor) throw new BadRequest('Guard already invited or has applied for this job.')
    const application = await db.insertAndFetch(Applications, { job_id, guard_id, status: APPLICATION_STATUS.REQUESTED })

    await new EmailService(guard).send({
      subject: `New Job request - ${job.title}`,
      html: `Hello ${guard.first_name}, <br/>You have a request to apply for a job. Pls login into your account to find out more.`
    }).catch(LoggerLib.error);

    return new ResponseLib(req, res).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    })
  } catch (error) {
    next(error)
  }
}


// get applications by status
export const getJobApplications =  async (req: express.Request, res: express.Response, next: express.NextFunction) => { 
  try {
    const user = req.user;
    const status = req.params.status as Applications['status'];
    const job_id = req.params.id;
    const { page, limit }: IRequestQuery = req.query;
    const db = new DBAdapter();
    const skip = (Number(page) - 1) * Number(limit);

    const total = await db.raw(`
      SELECT COUNT(DISTINCT a.id) AS total
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON j.client_id = u.id
      JOIN users g ON a.guard_id = g.id
      LEFT JOIN reviews r ON a.guard_id = r.guard_id
      WHERE
          a.job_id =${job_id}
          AND a.status ='${status}'
          AND j.client_id = ${user.id}
          AND a.deleted_flag = false
      `)

    const applications = await db.raw(`
      SELECT
          a.*,
          j.id AS job_id,
          u.id AS client_id,
          u.email AS client_email,
          u.first_name AS client_first_name,
          u.last_name AS client_last_name,
          g.id AS guard_id,
          g.email,
          g.first_name,
          g.last_name,
          g.role,
          g.description as guard_description,
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
                WHERE lcs.guard_id = g.id AND lcs.status != 'unverified'
            ), '[]'::json
        ) AS licenses,
        COALESCE(
            (
                SELECT json_agg(
                    json_build_object(
                        'review_id', r.id,
                        'job_id', r.job_id,
                        'review_description', r.description,
                        'review_rating', r.rating
                    )
                )
                FROM reviews r
                WHERE r.guard_id = g.id AND r.deleted_flag = false
            ), '[]'::json
        ) AS reviews,
          COALESCE((
              SELECT AVG(rating) FROM reviews WHERE guard_id = g.id
          ), 0) AS average_rating,
          j.title,
          j.address,
          j.client_id as client_id,
          j.description,
          j.budget,
          j.status,
          j.quantity,
          j.created_on,
          j."startDateTime",
          j."lookingFor"
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      INNER JOIN users u ON j.client_id = u.id
      INNER JOIN users g ON a.guard_id = g.id
      INNER JOIN profiles p ON p.user_id = g.id
      INNER JOIN locations l ON p.location_id = l.id
      LEFT JOIN reviews r ON a.guard_id = r.guard_id
      WHERE
          a.job_id =${job_id}
          AND a.status ='${status}'
          AND j.client_id = ${user.id}
          AND a.deleted_flag = false
      GROUP BY
          a.id, j.id, u.id, g.id, l.id
      ORDER BY a.created_on DESC
      LIMIT ${limit} OFFSET ${skip};
    `)

    console.log(total)

    return new ResponseLib(req, res).json({
      success: true,
      message: "Applications fetched successfully.",
      data: applications,
      meta: UtilsService.paginate(req.query, {items: applications, total: Number(total[0].total) })
    })
  } catch(error) {
    next(error)
  }
}


export const declineJobForGuard =  async (req: express.Request, res: express.Response, next: express.NextFunction) => { 
  try {
    const user = req.user;
    const { job_id, guard_id } = req.body;
    const db = new DBAdapter();
    const job = await db.findOne(Job, { where: { id: job_id, client_id: user.id,  status: STATUSES.OPEN, meta: { deleted_flag: false } }})
    const guard = await db.findOne(User, { where: { id: guard_id, meta: { deleted_flag: false }  }});

    if (!guard)  throw new BadRequest('Guard not found.');
    if (!job) throw new BadRequest('Job not found.');
    if (Number(job.quantity) < 1) throw new BadRequest("You cannot invite to this job, it is already filled out.")

    const isAppliedFor = await db.findOne(Applications, {
      where: {
        guard_id,
        job_id,
        meta: { deleted_flag: false }
      }
    });

    // if (isAppliedFor) throw new BadRequest('Guard already invited or has applied for this job.')
    const application = await db.insertAndFetch(Applications, { job_id, guard_id, status: APPLICATION_STATUS.REQUESTED })
    
    if (isAppliedFor) {
      await new EmailService(guard).send({
        subject: `Update on Job - ${job.title}`,
        html: `Hello ${guard.first_name}, <br/> Your job application has been declined.`
      }).catch(LoggerLib.error);
    }

    return new ResponseLib(req, res).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    })
  } catch (error) {
    next(error)
  }
}

// update application status
export const updateApplications =  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const user = req.user;
    const { application_id } = req.params;
    const { status, guard_id } = req.body;
    const db = new DBAdapter();
    let status_update = status
    if (status === APPLICATION_STATUS.UNDO_REFUSAL) {
      status_update = APPLICATION_STATUS.APPLIED
    }

    const guard = await db.findOne(User, { where: { id: guard_id, meta: { deleted_flag: false }  }});
    if (!guard)  throw new BadRequest('Guard not found.');

    const applicationFound = await db.findOne(Applications, { where: { id: Number(application_id), guard_id: Number(guard_id), meta: { deleted_flag: false}}});

    if (!applicationFound) {
      throw new BadRequest(`Job application not found or you don't have permission to ${status} this job.`);
    }

    const job = await db.findOne(Job, { where: { id: Number(applicationFound.job_id), client_id: user.id, meta: { deleted_flag: false } }});
    if (!job) throw new BadRequest('Job not found.');

    if(![
      APPLICATION_STATUS.REQUESTED, APPLICATION_STATUS.SHORTLISTED, APPLICATION_STATUS.HIRE_REQUEST,
      APPLICATION_STATUS.DECLINED, APPLICATION_STATUS.UNDO_REFUSAL, APPLICATION_STATUS.UNDO
    ].includes(status)) throw new BadRequest(`You cannot update status of this job application to: ${status}.`)

    const application = await db.updateAndFetch(Applications, {
      job_id: Number(job.id)
    }, {
      status: status_update
    }, {
      job: true
    })

    await new EmailService(guard).send({
      subject: `Update on Job - ${job.title}`,
      html: `Hello ${guard.first_name}, <br/> You have an update on your job application. Please login to find out more.`
    }).catch(LoggerLib.error);

    return new ResponseLib(req, res).json({
      success: true,
      message: "Application status updated successfully.",
      data: application
    })

  } catch (error) {
    next(error)
  }
}

// application analytics
export const applicationsAnalytics =  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { id } = req.params;
    const db = new DBAdapter();
    const status = await db.raw(`
      SELECT
        status,
        COUNT(*) AS count
      FROM applications
      WHERE job_id = ${id} 
      AND deleted_flag=false
      GROUP BY status;
    `)

    const format = (data: any) => {
      return data.map((d: any) => ({
        [d.status]: d.count
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
      message: "Data fetched successfully",
      data: flattenList(format(status))
    })
  } catch (error) {
    next(error)
  }
}
