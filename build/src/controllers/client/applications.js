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
exports.applicationsAnalytics = exports.updateApplications = exports.declineJobForGuard = exports.getJobApplications = exports.inviteToApply = void 0;
const DBAdapter_1 = __importDefault(require("../../adapters/DBAdapter"));
const Response_Lib_1 = __importDefault(require("../../libs/Response.Lib"));
const Job_entity_1 = require("../../db/entities/Job.entity");
const Error_Lib_1 = require("../../libs/Error.Lib");
const Application_entity_1 = require("../../db/entities/Application.entity");
const config_1 = require("../../config");
const Utils_Service_1 = __importDefault(require("../../services/Utils.Service"));
const Email_Service_1 = __importDefault(require("../../services/Email.Service"));
const User_entity_1 = require("../../db/entities/User.entity");
const Logger_Lib_1 = __importDefault(require("../../libs/Logger.Lib"));
// invite to job
const inviteToApply = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { job_id, guard_id } = req.body;
        const db = new DBAdapter_1.default();
        const job = yield db.findOne(Job_entity_1.Job, { where: { id: job_id, client_id: user.id, status: config_1.STATUSES.OPEN, meta: { deleted_flag: false } } });
        const guard = yield db.findOne(User_entity_1.User, { where: { id: guard_id, meta: { deleted_flag: false } } });
        if (!guard)
            throw new Error_Lib_1.BadRequest('Guard not found.');
        if (!job)
            throw new Error_Lib_1.BadRequest('Job not found.');
        if (Number(job.quantity) < 1)
            throw new Error_Lib_1.BadRequest("You cannot invite to this job, it is already filled out.");
        const isAppliedFor = yield db.findOne(Application_entity_1.Applications, {
            where: {
                guard_id,
                job_id,
                meta: { deleted_flag: false }
            }
        });
        if (isAppliedFor)
            throw new Error_Lib_1.BadRequest('Guard already invited or has applied for this job.');
        const application = yield db.insertAndFetch(Application_entity_1.Applications, { job_id, guard_id, status: config_1.APPLICATION_STATUS.REQUESTED });
        yield new Email_Service_1.default(guard).send({
            subject: `New Job request - ${job.title}`,
            html: `Hello ${guard.first_name}, <br/>You have a request to apply for a job. Pls login into your account to find out more.`
        }).catch(Logger_Lib_1.default.error);
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
exports.inviteToApply = inviteToApply;
// get applications by status
const getJobApplications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const status = req.params.status;
        const job_id = req.params.id;
        const { page, limit } = req.query;
        const db = new DBAdapter_1.default();
        const skip = (Number(page) - 1) * Number(limit);
        const total = yield db.raw(`
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
      `);
        const applications = yield db.raw(`
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
    `);
        console.log(total);
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: "Applications fetched successfully.",
            data: applications,
            meta: Utils_Service_1.default.paginate(req.query, { items: applications, total: Number(total[0].total) })
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getJobApplications = getJobApplications;
const declineJobForGuard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { job_id, guard_id } = req.body;
        const db = new DBAdapter_1.default();
        const job = yield db.findOne(Job_entity_1.Job, { where: { id: job_id, client_id: user.id, status: config_1.STATUSES.OPEN, meta: { deleted_flag: false } } });
        const guard = yield db.findOne(User_entity_1.User, { where: { id: guard_id, meta: { deleted_flag: false } } });
        if (!guard)
            throw new Error_Lib_1.BadRequest('Guard not found.');
        if (!job)
            throw new Error_Lib_1.BadRequest('Job not found.');
        if (Number(job.quantity) < 1)
            throw new Error_Lib_1.BadRequest("You cannot invite to this job, it is already filled out.");
        const isAppliedFor = yield db.findOne(Application_entity_1.Applications, {
            where: {
                guard_id,
                job_id,
                meta: { deleted_flag: false }
            }
        });
        // if (isAppliedFor) throw new BadRequest('Guard already invited or has applied for this job.')
        const application = yield db.insertAndFetch(Application_entity_1.Applications, { job_id, guard_id, status: config_1.APPLICATION_STATUS.REQUESTED });
        if (isAppliedFor) {
            yield new Email_Service_1.default(guard).send({
                subject: `Update on Job - ${job.title}`,
                html: `Hello ${guard.first_name}, <br/> Your job application has been declined.`
            }).catch(Logger_Lib_1.default.error);
        }
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
exports.declineJobForGuard = declineJobForGuard;
// update application status
const updateApplications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { application_id } = req.params;
        const { status, guard_id } = req.body;
        const db = new DBAdapter_1.default();
        let status_update = status;
        if (status === config_1.APPLICATION_STATUS.UNDO_REFUSAL) {
            status_update = config_1.APPLICATION_STATUS.APPLIED;
        }
        const guard = yield db.findOne(User_entity_1.User, { where: { id: guard_id, meta: { deleted_flag: false } } });
        if (!guard)
            throw new Error_Lib_1.BadRequest('Guard not found.');
        const applicationFound = yield db.findOne(Application_entity_1.Applications, { where: { id: Number(application_id), guard_id: Number(guard_id), meta: { deleted_flag: false } } });
        if (!applicationFound) {
            throw new Error_Lib_1.BadRequest(`Job application not found or you don't have permission to ${status} this job.`);
        }
        const job = yield db.findOne(Job_entity_1.Job, { where: { id: Number(applicationFound.job_id), client_id: user.id, meta: { deleted_flag: false } } });
        if (!job)
            throw new Error_Lib_1.BadRequest('Job not found.');
        if (![
            config_1.APPLICATION_STATUS.REQUESTED, config_1.APPLICATION_STATUS.SHORTLISTED, config_1.APPLICATION_STATUS.HIRE_REQUEST,
            config_1.APPLICATION_STATUS.DECLINED, config_1.APPLICATION_STATUS.UNDO_REFUSAL, config_1.APPLICATION_STATUS.UNDO
        ].includes(status))
            throw new Error_Lib_1.BadRequest(`You cannot update status of this job application to: ${status}.`);
        const application = yield db.updateAndFetch(Application_entity_1.Applications, {
            job_id: Number(job.id)
        }, {
            status: status_update
        }, {
            job: true
        });
        yield new Email_Service_1.default(guard).send({
            subject: `Update on Job - ${job.title}`,
            html: `Hello ${guard.first_name}, <br/> You have an update on your job application. Please login to find out more.`
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
        const { id } = req.params;
        const db = new DBAdapter_1.default();
        const status = yield db.raw(`
      SELECT
        status,
        COUNT(*) AS count
      FROM applications
      WHERE job_id = ${id} 
      AND deleted_flag=false
      GROUP BY status;
    `);
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
            data: flattenList(format(status))
        });
    }
    catch (error) {
        next(error);
    }
});
exports.applicationsAnalytics = applicationsAnalytics;
