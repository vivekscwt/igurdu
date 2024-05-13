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
exports.guardDashboard = void 0;
const DBAdapter_1 = __importDefault(require("../../adapters/DBAdapter"));
const Application_entity_1 = require("../../db/entities/Application.entity");
const Response_Lib_1 = __importDefault(require("../../libs/Response.Lib"));
// stats / recent applications
const guardDashboard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const db = new DBAdapter_1.default();
        const query = `
      SELECT status AS type, COALESCE(COUNT(*), 0) AS total_count
      FROM applications a
      WHERE a.guard_id = ${user.id} and a.deleted_flag = false
      GROUP BY a.status
      
      UNION
      
      SELECT 'reviews' AS type, COUNT(*) AS total_count
      FROM reviews
      WHERE guard_id =  ${user.id}
    `;
        const totalQuery = `
      SELECT 
          'applied' AS type,
          COUNT(DISTINCT job_id) AS total_count
      FROM
          applications
      WHERE 
          guard_id = 1 AND 
          deleted_flag = false;
    `;
        const [status, total, mostRecentJobs] = yield Promise.all([
            db.raw(query),
            db.raw(totalQuery),
            db.find(Application_entity_1.Applications, {
                where: {
                    guard_id: user.id,
                    meta: { deleted_flag: false }
                },
                relations: { job: true },
                take: 3,
                order: { meta: { created_on: 'DESC' } }
            })
        ]);
        const format = (data) => {
            return data.map((d) => ({
                [d.type]: d.total_count
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
            data: {
                myJobsData: Object.assign(Object.assign({}, flattenList(format(status))), flattenList(format(total))),
                mostRecentJobs
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.guardDashboard = guardDashboard;
