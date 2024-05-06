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
exports.updateLicenseStatus = exports.getAllGuards = void 0;
const DBAdapter_1 = __importDefault(require("../../adapters/DBAdapter"));
const Response_Lib_1 = __importDefault(require("../../libs/Response.Lib"));
const License_entity_1 = require("../../db/entities/License.entity");
const getAllGuards = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, account_status, expiry, page, limit } = req.query;
        const db = new DBAdapter_1.default();
        const skip = (Number(page) - 1) * Number(limit);
        const user_status_filter = account_status && account_status !== 'all' ? `AND u.status = '${account_status}'` : '';
        const license_filter = status && status !== 'all' ? `AND lc.status = '${status}'` : '';
        const result = yield db.raw(`
      SELECT DISTINCT ON (u.id) u.id AS guard_id,
        u.email AS guard_email,
        u.first_name AS guard_first_name,
        u.last_name AS guard_last_name,
        u.description AS guard_description,
        u.phone as guard_phone,
        u.role,
        u.status,
        u.created_on as guard_created_on,
        l.id AS location_id,
        l.address AS location_address,
        l.lat AS location_lat,
        l.lng AS location_lng,
        pd.*,
        COALESCE(
          (
            SELECT json_agg(license_obj)
            FROM (
              SELECT DISTINCT ON (lc.id)
                json_build_object(
                  'id', lc.id,
                  'role', lc.role,
                  'sia_number', lc.sia_number,
                  'expiry_date_from', lc.expiry_date_from,
                  'expiry_date_to', lc.expiry_date_to,
                  'sector', lc.sector,
                  'guard_id', lc.guard_id,
                  'trades', lc.trades,
                  'status', lc.status
                ) AS license_obj
              FROM
                licenses lc
              WHERE
                lc.guard_id = u.id
                ${license_filter}
            ) AS subquery
          ),
          '[]'::json
        ) AS licenses,
        COALESCE(
          json_agg(json_build_object(
            'id', d.id,
            'user_id', d.user_id,
            'url', d.url
          )) FILTER (WHERE d.id IS NOT NULL),
          '[]'::json
        ) AS documents,
        COALESCE(
          json_agg(json_build_object(
            'id', r.id,
            'title', j.title,
            'description', r.description,
            'rating', r.rating,
            'first_name', c.first_name,
            'last_name', c.last_name,
            'created_on', r.created_on
          )) FILTER (WHERE r.id IS NOT NULL),
          '[]'::json
        ) AS reviews,
        AVG(r.rating) AS average_rating,
        json_build_object(
            'number_of_ratings',  COALESCE(COUNT(r.rating), 0),
            'five_star', COALESCE(SUM(CASE WHEN ROUND(r.rating) = 5 THEN 1 ELSE 0 END), 0),
            'four_star', COALESCE(SUM(CASE WHEN ROUND(r.rating) = 4 THEN 1 ELSE 0 END), 0),
            'three_star', COALESCE(SUM(CASE WHEN ROUND(r.rating) = 3 THEN 1 ELSE 0 END), 0),
            'two_star', COALESCE(SUM(CASE WHEN ROUND(r.rating) = 2 THEN 1 ELSE 0 END), 0),
            'one_star', COALESCE(SUM(CASE WHEN ROUND(r.rating) = 1 THEN 1 ELSE 0 END), 0)
        ) AS star_average
      FROM
        users u
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN locations l ON p.location_id = l.id
      LEFT JOIN licenses lc ON u.id = lc.guard_id
      LEFT JOIN professional_details pd ON u.id = p.user_id
      LEFT JOIN documents d ON u.id = d.user_id
      LEFT JOIN reviews r ON u.id = r.guard_id
      LEFT JOIN jobs j ON j.id = r.job_id
      LEFT JOIN users c on r.client_id = c.id
      WHERE u.role = 'guard' AND u.deleted_flag=FALSE ${user_status_filter}
      GROUP BY u.id, l.id, p.id, pd.id, lc.id
      ORDER BY u.id,  TO_DATE(lc.expiry_date_to, 'YYYY-MM-DD') DESC
      LIMIT ${limit} OFFSET ${skip};
    `);
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: "All guards fetched.",
            data: result !== null && result !== void 0 ? result : {}
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllGuards = getAllGuards;
const updateLicenseStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const db = new DBAdapter_1.default();
        const license = yield db.updateAndFetch(License_entity_1.License, {
            id: Number(id),
            meta: { deleted_flag: false }
        }, { status });
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: 'License status updated.',
            data: license
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateLicenseStatus = updateLicenseStatus;
