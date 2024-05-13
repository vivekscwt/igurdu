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
exports.findGuards = exports.listJobs = void 0;
const Response_Lib_1 = __importDefault(require("../../libs/Response.Lib"));
const DBAdapter_1 = __importDefault(require("../../adapters/DBAdapter"));
const Job_entity_1 = require("../../db/entities/Job.entity");
const Utils_Service_1 = __importDefault(require("../../services/Utils.Service"));
// list
const listJobs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const db = new DBAdapter_1.default();
        const { budget, created_at, page, limit } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const [jobs, total] = yield db.findAndCount(Job_entity_1.Job, {
            where: {
                client_id: user.id,
            },
            skip,
            take: limit,
            order: {
                budget: budget === 'highest' ? 'ASC' : 'DESC',
                meta: { created_on: created_at === 'newest' ? 'ASC' : 'DESC' }
            }
        });
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: "Jobs fetched successfully.",
            data: jobs,
            meta: Utils_Service_1.default.paginate(req.query, { items: jobs, total })
        });
    }
    catch (error) {
        next(error);
    }
});
exports.listJobs = listJobs;
// find guards
const findGuards = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const db = new DBAdapter_1.default();
        const { id } = req.params;
        const query = `
      SELECT DISTINCT ON (u.id)
          u.id as guard_id,
          j.id AS job_id,
          u.email,
          u.first_name,
          u.last_name,
          u.role,
          u.description as guard_description,
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
                WHERE lcs.guard_id = u.id AND lcs.status != 'unverified'
            ), '[]'::json
        ) AS licenses,
        COALESCE(
            (
                SELECT json_agg(
                    json_build_object(
                        'review_id', r.id,
                        'review_description', r.description,
                        'review_rating', r.rating
                    )
                )
                FROM reviews r
                WHERE r.guard_id = u.id
            ), '[]'::json
        ) AS reviews,
          COALESCE((
              SELECT AVG(rating) FROM reviews WHERE guard_id = u.id
          ), 0) AS average_rating,
          j.*,
              (acos(
                  sin(radians(CAST(l.lat AS double precision))) * sin(radians(CAST(j.lat AS double precision))) +
                  cos(radians(CAST(l.lat AS double precision))) * cos(radians(CAST(j.lat AS double precision))) * 
                  cos(radians(CAST(l.lng AS double precision) - CAST(j.lng AS double precision)))
              ) * 6371) AS distance_to_job
          FROM jobs j
          INNER JOIN users u ON u.role = 'guard'
          INNER JOIN json_array_elements_text(j."lookingFor") AS job_trade ON true
          INNER JOIN profiles p ON p.user_id = u.id
          INNER JOIN locations l ON p.location_id = l.id
          INNER JOIN licenses lcs ON p.user_id = lcs.guard_id AND lcs.status != 'unverified'
          INNER JOIN json_array_elements_text(lcs.trades) AS license_trade ON job_trade = license_trade
      WHERE j.status = 'open'
      AND j.id =${id}
      AND j.deleted_flag = false
      AND j.client_id = ${user.id}
      AND u.status != 'pending'
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
      )
      GROUP BY j.id, u.id, l.id, lcs.id
      ORDER BY u.id, distance_to_job;
    `;
        const result = yield db.raw(query);
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: "Successfully fetched guards.",
            data: result
        });
    }
    catch (error) {
        next();
    }
});
exports.findGuards = findGuards;
