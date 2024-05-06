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
exports.dashboardCharts = exports.clientDashboard = void 0;
const Response_Lib_1 = __importDefault(require("../../libs/Response.Lib"));
const DBAdapter_1 = __importDefault(require("../../adapters/DBAdapter"));
// job/ application aggregates
const clientDashboard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = req.user;
        const user_id = user.id;
        const db = new DBAdapter_1.default();
        const result = yield db.raw(`
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
    `);
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: "Dashboard data loaded successfully.",
            data: (_a = result[0]) !== null && _a !== void 0 ? _a : {}
        });
    }
    catch (error) {
        next(error);
    }
});
exports.clientDashboard = clientDashboard;
// charts
const dashboardCharts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const user_id = user.id;
        const db = new DBAdapter_1.default();
        const [applications, jobs] = yield Promise.all([
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
        ]);
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: "Dashboard data loaded successfully.",
            data: {
                jobs,
                applications
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.dashboardCharts = dashboardCharts;
