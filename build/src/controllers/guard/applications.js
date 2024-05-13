"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationsAnalytics = exports.updateApplications = exports.getApplications = exports.applyJobs = exports.myJobs = void 0;
const DBAdapter_1 = __importDefault(require("../../adapters/DBAdapter"));
const Response_Lib_1 = __importDefault(require("../../libs/Response.Lib"));
const Profile_entity_1 = require("../../db/entities/Profile.entity");
const Job_entity_1 = require("../../db/entities/Job.entity");
const Error_Lib_1 = require("../../libs/Error.Lib");
const Application_entity_1 = require("../../db/entities/Application.entity");
const config_1 = require("../../config");
const Email_Service_1 = __importDefault(require("../../services/Email.Service"));
const User_entity_1 = require("../../db/entities/User.entity");
const Logger_Lib_1 = __importDefault(require("../../libs/Logger.Lib"));
const myJobs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { budget, created_at } = req.query;
        const db = new DBAdapter_1.default();
        const profile = yield db.findOne(Profile_entity_1.Profile, {
            where: {
                user_id: user.id,
                meta: { deleted_flag: false }
            }
        });
        if (!profile) {
            return new Response_Lib_1.default(req, res).json({
                status: true,
                message: 'Complete your profile to get job matches.',
                data: null
            });
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
    `;
        const foundJobs = yield db.raw(query);
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: 'Jobs retrieved successfully',
            data: foundJobs,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.myJobs = myJobs;
const applyJobs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { job_id } = req.body;
        const db = new DBAdapter_1.default();
        const job = yield db.findOne(Job_entity_1.Job, { where: { id: job_id, status: config_1.STATUSES.OPEN, meta: { deleted_flag: false } } });
        if (!job)
            throw new Error_Lib_1.BadRequest('Job not found.');
        if (Number(job.quantity) < 1)
            throw new Error_Lib_1.BadRequest("You cannot apply for this job, it is already filled out.");
        let application;
        const isAppliedFor = yield db.findOne(Application_entity_1.Applications, {
            where: {
                guard_id: user.id,
                job_id,
                meta: { deleted_flag: false }
            }
        });
        if (isAppliedFor) {
            if (isAppliedFor.status === 'requested') {
                application = yield db.updateAndFetch(Application_entity_1.Applications, {
                    guard_id: user.id, job_id
                }, { status: config_1.APPLICATION_STATUS.APPLIED, previous_status: isAppliedFor.status });
            }
            else {
                throw new Error_Lib_1.BadRequest('You have already applied for this job.');
            }
        }
        else {
            application = yield db.insertAndFetch(Application_entity_1.Applications, { job_id, guard_id: user.id });
        }
        // new EmailService(guard).send()
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: 'Application submitted successfully',
            data: application
        });
    }
    catch (error) {
        next(error);
    }
});
exports.applyJobs = applyJobs;
// get applications by status
const getApplications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const status = req.params.status;
        const { page, limit } = req.query;
        const db = new DBAdapter_1.default();
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
        const applications = yield db.raw(`
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

    `);
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: "Applications fetched successfully.",
            data: applications
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getApplications = getApplications;
// update application status
const updateApplications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { job_id } = req.params;
        const { status } = req.body;
        const db = new DBAdapter_1.default();
        const job = yield db.findOne(Job_entity_1.Job, { where: { id: Number(job_id), meta: { deleted_flag: false } } });
        if (!job)
            throw new Error_Lib_1.BadRequest('Job not found.');
        const client = yield db.findOne(User_entity_1.User, { where: { id: job.client_id, meta: { deleted_flag: false } } });
        if (!client)
            throw new Error_Lib_1.BadRequest('User not found. Pls contact support.');
        if (![
            'applied', 'hired', 'declined'
        ].includes(status))
            throw new Error_Lib_1.BadRequest(`You cannot update status of your job application to: ${status}.`);
        if (status === 'hired') {
            const job = yield db.findOne(Job_entity_1.Job, { where: { id: Number(job_id), meta: { deleted_flag: false } } });
            const currentQuantity = parseInt(job === null || job === void 0 ? void 0 : job.quantity, 10);
            const newQuantity = Math.max(currentQuantity - 1, 0);
            yield db.update(Job_entity_1.Job, { id: Number(job_id), meta: { deleted_flag: false } }, {
                quantity: String(newQuantity)
            });
        }
        const application = yield db.updateAndFetch(Application_entity_1.Applications, {
            job_id: Number(job_id),
            guard_id: user.id
        }, {
            status
        }, {
            job: true
        });
        if (!application) {
            throw new Error_Lib_1.BadRequest(`Job application not found or you don't have permission to ${status} this job.`);
        }
        yield new Email_Service_1.default(client).send({
            subject: `Update on Job - ${job.title}`,
            html: `Hello ${client.first_name}, <br/> You have an update on your job application. Please login to find out more.`
        }).catch(Logger_Lib_1.default.error);
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: "Application status updated successfully.",
            data: application
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateApplications = updateApplications;
// application analytics
const applicationsAnalytics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const db = new DBAdapter_1.default();
        const [jobsFound, status] = yield Promise.all([
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
        ]);
        const format = (data) => {
            return data.map((d) => ({
                [d.status]: d.count
            }));
        };
        function flattenList(data) {
            const flattenedObject = {};
            for (const item of data) {
                Object.assign(flattenedObject, item);
            }
            return flattenedObject;
        }
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: "Data fetched successfully",
            data: Object.assign(Object.assign({}, flattenList(format(status))), { jobsFound: jobsFound[0].count })
        });
    }
    catch (error) {
        next(error);
    }
});
exports.applicationsAnalytics = applicationsAnalytics;
