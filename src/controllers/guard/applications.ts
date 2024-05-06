import express from 'express';
import DBAdapter from '../../adapters/DBAdapter';
import ResponseLib from '../../libs/Response.Lib';
import { Profile } from '../../db/entities/Profile.entity';
import { Job } from '../../db/entities/Job.entity';
import { BadRequest } from '../../libs/Error.Lib';
import { Applications } from '../../db/entities/Application.entity';
import { APPLICATION_STATUS, STATUSES } from '../../config';
import { IRequestQuery } from '../../interfaces/requests/request.interface';
import EmailService from '../../services/Email.Service';
import { User } from '../../db/entities/User.entity';
import LoggerLib from '../../libs/Logger.Lib';

export const myJobs = async (req: express.Request, res: express.Response, next: express.NextFunction) => { 
  try {
    const user = req.user;
    const { budget, created_at } = req.query
    const db = new DBAdapter();
    const profile = await db.findOne(Profile, {
      where: {
        user_id: user.id,
        meta: { deleted_flag: false }
      }
    })

    if (!profile) {
      return new ResponseLib(req, res).json({
        status: true,
        message: 'Complete your profile to get job matches.',
        data: null
      })
    }

    const query = `
      SELECT DISTINCT ON (j.id) j.id as job_id, j.*, u.first_name AS posted_by_first_name, u.last_name AS posted_by_last_name,
          p.user_id AS guard_id, p.location_id AS guard_location_id, lcs.*,
          l.lat AS guard_lat, l.lng AS guard_lng,
          (acos(
            sin(radians(CAST(l.lat AS double precision))) * sin(radians(CAST(j.lat AS double precision))) +
            cos(radians(CAST(l.lat AS double precision))) * cos(radians(CAST(j.lat AS double precision))) * 
            cos(radians(CAST(l.lng AS double precision) - CAST(j.lng AS double precision)))
          ) * 6371) AS distance_to_job

      FROM jobs j
      INNER JOIN users u ON j.client_id = u.id
      INNER JOIN users g ON  g.id = ${user.id} and g.role = 'guard'
      INNER JOIN profiles p ON p.user_id = g.id
      INNER JOIN licenses lcs ON lcs.guard_id = p.user_id AND lcs.status != 'unverified'
      INNER JOIN json_array_elements_text(j."lookingFor") AS job_trade ON true
      INNER JOIN json_array_elements_text(lcs.trades) AS license_trade ON job_trade = license_trade
      INNER JOIN locations l ON p.location_id = l.id
      WHERE j.status = 'open'
      AND j.deleted_flag = false
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
            AND a.guard_id = g.id
            AND a.deleted_flag = false
        )

      ORDER BY 
      j.id,
    CASE WHEN '${budget}' = 'highest' THEN j.budget END DESC,
    CASE WHEN '${budget}' = 'lowest' THEN j.budget END ASC
    `
    
    const foundJobs = await db.raw(query);
    
    return new ResponseLib(req, res).json({
      success: true,
      message: 'Jobs retrieved successfully',
      data: foundJobs,
    })
  } catch (error) {
    next(error)
  }
}

export const applyJobs =  async (req: express.Request, res: express.Response, next: express.NextFunction) => { 
  try {
    const user = req.user;
    const { job_id } = req.body;
    const db = new DBAdapter();
    const job = await db.findOne(Job, { where: { id: job_id, status: STATUSES.OPEN, meta: { deleted_flag: false } }})

    if (!job) throw new BadRequest('Job not found.');
    if (Number(job.quantity) < 1) throw new BadRequest("You cannot apply for this job, it is already filled out.")

    let application;
    const isAppliedFor = await db.findOne(Applications, {
      where: {
        guard_id: user.id,
        job_id,
        meta: { deleted_flag: false }
      }
    });

    if (isAppliedFor) {
      if (isAppliedFor.status === 'requested') {
        application = await db.updateAndFetch(Applications, {
          guard_id: user.id, job_id
        }, { status: APPLICATION_STATUS.APPLIED, previous_status: isAppliedFor.status })
      } else {
        throw new BadRequest('You have already applied for this job.')
      }
    } else {
      application = await db.insertAndFetch(Applications, { job_id, guard_id: user.id })
    }

    // new EmailService(guard).send()

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
export const getApplications =  async (req: express.Request, res: express.Response, next: express.NextFunction) => { 
  try {
    const user = req.user;
    const status = req.params.status as Applications['status'];
    const { page, limit }: IRequestQuery = req.query;
    const db = new DBAdapter();
    const skip = (Number(page) - 1) * Number(limit);


    // const applications = await db.find(Applications, {
    //   where: {
    //     guard_id: user.id,
    //     status: status,
    //     meta: { deleted_flag: false }
    //   },
    //   relations: {
    //     job: {
    //       user: true
    //     }
    //   },
    //   skip,
    //   take: limit,
    //   order: { meta: { created_on: 'DESC' } }
    // })

    const applications = await db.raw(`
    SELECT DISTINCT ON (j.id)
        j.*, 
        u.first_name AS posted_by_first_name, 
        u.last_name AS posted_by_last_name,
        p.user_id AS guard_id, 
        p.location_id AS guard_location_id, 
        l.lat AS guard_lat, 
        l.lng AS guard_lng
    FROM 
        applications a
    INNER JOIN
        jobs j ON a.job_id = j.id
    INNER JOIN 
        users u ON j.client_id = u.id
    INNER JOIN 
        profiles p ON p.user_id = a.guard_id
    INNER JOIN 
        locations l ON p.location_id = l.id
    WHERE 
        j.status = 'open'
        AND j.deleted_flag = false
        AND a.guard_id = ${user.id}
        AND a.status ='${status}'
    ORDER BY j.id 
    LIMIT ${limit} OFFSET ${skip};

    `)

    return new ResponseLib(req, res).json({
      success: true,
      message: "Applications fetched successfully.",
      data: applications
    })
  } catch(error) {
    next(error)
  }
}

// update application status
export const updateApplications =  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const user = req.user;
    const { job_id } = req.params;
    const { status } = req.body;
    const db = new DBAdapter();

    const job = await db.findOne(Job, { where: { id: Number(job_id), meta: { deleted_flag: false } }});
    if (!job) throw new BadRequest('Job not found.');

    const client = await db.findOne(User, { where: { id: job.client_id, meta: { deleted_flag: false } }})
    if (!client) throw new BadRequest('User not found. Pls contact support.');

    if(![
      'applied', 'hired', 'declined'
    ].includes(status)) throw new BadRequest(`You cannot update status of your job application to: ${status}.`)

    if (status === 'hired') {
      const job = await db.findOne(Job, { where: { id: Number(job_id), meta: { deleted_flag: false } }});
      const currentQuantity = parseInt(job?.quantity!, 10);
    
      const newQuantity = Math.max(currentQuantity - 1, 0);
      await db.update(Job, { id: Number(job_id), meta: { deleted_flag: false} }, {
        quantity: String(newQuantity)
      })
    }

    const application = await db.updateAndFetch(Applications, {
      job_id: Number(job_id),
      guard_id: user.id
    }, {
      status
    }, {
      job: true
    })

    if (!application) {
      throw new BadRequest(`Job application not found or you don't have permission to ${status} this job.`);
    }

    await new EmailService(client).send({
      subject: `Update on Job - ${job.title}`,
      html: `Hello ${client.first_name}, <br/> You have an update on your job application. Please login to find out more.`
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
    const user = req.user;
    const db = new DBAdapter();

    const [jobsFound, status] = await Promise.all([
      db.raw(`
        SELECT COUNT(*) as count
        FROM jobs j
        INNER JOIN users u ON u.id = ${user.id}
        INNER JOIN profiles p ON p.user_id = u.id
        INNER JOIN licenses lcs ON lcs.guard_id = p.user_id AND lcs.status != 'unverified'
        INNER JOIN json_array_elements_text(j."lookingFor") AS job_trade ON true
        INNER JOIN json_array_elements_text(lcs.trades) AS license_trade ON job_trade = license_trade
        INNER JOIN locations l ON p.location_id = l.id
        WHERE j.status = 'open'
        AND j.deleted_flag = false
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
        );
      `),
      db.raw(`
        SELECT
          status,
          COUNT(*) AS count
        FROM applications
        WHERE guard_id = ${user.id} AND deleted_flag=false
        GROUP BY status;
      `)
    ])

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
      data: { ...flattenList(format(status)), jobsFound: jobsFound[0].count}
    })
  } catch (error) {
    next(error)
  }
}