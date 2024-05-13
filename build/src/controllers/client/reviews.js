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
exports.listReviews = exports.writeReviews = void 0;
const Response_Lib_1 = __importDefault(require("../../libs/Response.Lib"));
const DBAdapter_1 = __importDefault(require("../../adapters/DBAdapter"));
const Error_Lib_1 = require("../../libs/Error.Lib");
const Application_entity_1 = require("../../db/entities/Application.entity");
const Review_entity_1 = require("../../db/entities/Review.entity");
const Utils_Service_1 = __importDefault(require("../../services/Utils.Service"));
// write reviews
const writeReviews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { guard_id, job_id, rating, title, description, work_completed_at } = req.body;
        const db = new DBAdapter_1.default();
        const application = yield db.findOne(Application_entity_1.Applications, { where: {
                job_id: Number(job_id),
                guard_id: Number(guard_id),
                meta: { deleted_flag: false }
            } });
        if (!application)
            throw new Error_Lib_1.BadRequest('Application not found.');
        const foundReview = yield db.findOne(Review_entity_1.Review, {
            where: {
                job_id: Number(job_id),
                guard_id: Number(guard_id),
                client_id: user.id,
                meta: { deleted_flag: false }
            }
        });
        let review;
        if (foundReview) {
            review = yield db.updateAndFetch(Review_entity_1.Review, {
                job_id: Number(job_id),
                guard_id: Number(guard_id),
                client_id: user.id,
                meta: { deleted_flag: false }
            }, {
                title,
                description,
                rating,
                work_completed_at,
            });
        }
        else {
            review = yield db.insertAndFetch(Review_entity_1.Review, {
                title,
                description,
                rating,
                work_completed_at,
                job_id: Number(job_id),
                guard_id: Number(guard_id),
                client_id: user.id
            });
        }
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: "Review submitted successfully.",
            data: review
        });
    }
    catch (error) {
        next(error);
    }
});
exports.writeReviews = writeReviews;
// get reviews
const listReviews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { page, limit } = req.query;
        const db = new DBAdapter_1.default();
        const skip = (Number(page) - 1) * Number(limit);
        const [review, total] = yield db.findAndCount(Review_entity_1.Review, {
            where: {
                client_id: user.id,
                meta: { deleted_flag: false }
            },
            relations: {
                guard: true,
                client: true,
                job: true,
            },
            skip,
            take: limit
        });
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: "Review submitted successfully.",
            data: review,
            meta: Utils_Service_1.default.paginate(req.query, { items: review, total })
        });
    }
    catch (error) {
        next(error);
    }
});
exports.listReviews = listReviews;
