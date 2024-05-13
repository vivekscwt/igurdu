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
exports.dashboardCharts = exports.adminDashboard = void 0;
const DBAdapter_1 = __importDefault(require("../../adapters/DBAdapter"));
const Response_Lib_1 = __importDefault(require("../../libs/Response.Lib"));
const adminDashboard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const db = new DBAdapter_1.default();
        const result = yield db.raw(`
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
  `);
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: "Dashboard data fetched.",
            data: (_a = result[0]) !== null && _a !== void 0 ? _a : {}
        });
    }
    catch (error) {
        next(error);
    }
});
exports.adminDashboard = adminDashboard;
const dashboardCharts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = new DBAdapter_1.default();
        const [totalUsers, totalApplications, totalJobs] = yield Promise.all([
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
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: "Dashboard data fetched.",
            data: {
                allUsers: totalUsers !== null && totalUsers !== void 0 ? totalUsers : [],
                jobChart: totalApplications.concat(totalJobs)
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.dashboardCharts = dashboardCharts;
