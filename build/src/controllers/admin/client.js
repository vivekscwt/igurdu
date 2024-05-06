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
exports.getAllClients = void 0;
const DBAdapter_1 = __importDefault(require("../../adapters/DBAdapter"));
const Response_Lib_1 = __importDefault(require("../../libs/Response.Lib"));
const Utils_Service_1 = __importDefault(require("../../services/Utils.Service"));
const getAllClients = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { order_by, status, page, limit } = req.query;
        const db = new DBAdapter_1.default();
        const skip = (Number(page) - 1) * Number(limit);
        const sort_by = order_by === 'newest' ? 'DESC' : 'ASC';
        const status_filter = status ? `AND u.status=${status}` : '';
        const total = yield db.raw(`SELECT COUNT(*) AS total FROM users WHERE role = 'client' `);
        const clients = yield db.raw(`
        SELECT
            u.id,
            u.first_name,
            u.last_name,
            u.email,
            u.phone,
            u.status,
            u.created_on,
            COUNT(DISTINCT j.id) AS total_jobs_posted,
            COALESCE(
              ( 
                SELECT json_agg(review_obj)
                FROM (
                  SELECT DISTINCT ON (rs.id)
                  json_build_object(
                          'id', rs.id,
                          'description', rs.description,
                          'rating', rs.rating,
                          'create_on', rs.created_on,
                          'job_id', j.id,
                          'title', j.title,
                          'first_name', g.first_name,
                          'last_name', g.last_name
                ) as review_obj FROM reviews rs
                LEFT JOIN jobs j on rs.job_id = j.id
                WHERE rs.client_id = u.id
                ) AS subquery
                ),
          '[]'::json
            ) AS client_reviews
        FROM users u
        LEFT JOIN jobs j ON u.id = j.client_id
        LEFT JOIN reviews r ON u.id = r.client_id
        LEFT JOIN users g ON g.id = r.guard_id
        WHERE u.role = 'client' AND u.deleted_flag=FALSE ${status_filter}
        GROUP BY u.id, g.id
        ORDER BY u.created_on ${sort_by}
        LIMIT ${limit} OFFSET ${skip};
    `);
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: 'License status updated.',
            data: clients,
            meta: Utils_Service_1.default.paginate(req.query, { items: clients, total: Number(total[0].total) })
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllClients = getAllClients;
