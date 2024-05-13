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
exports.deleteReview = exports.getAllReviews = void 0;
const DBAdapter_1 = __importDefault(require("../../adapters/DBAdapter"));
const Response_Lib_1 = __importDefault(require("../../libs/Response.Lib"));
const Utils_Service_1 = __importDefault(require("../../services/Utils.Service"));
const Review_entity_1 = require("../../db/entities/Review.entity");
const getAllReviews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const db = new DBAdapter_1.default();
        const skip = (Number(page) - 1) * Number(limit);
        const [reviews, total] = yield db.findAndCount(Review_entity_1.Review, {
            where: { meta: { deleted_flag: false } },
            relations: {
                client: true,
                job: true,
                guard: true
            },
            skip,
            take: limit
        });
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: 'Reviews fetched!',
            data: reviews,
            meta: Utils_Service_1.default.paginate(req.query, { items: reviews, total })
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllReviews = getAllReviews;
const deleteReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const db = new DBAdapter_1.default();
        yield db.update(Review_entity_1.Review, { id: Number(id) }, {
            meta: { deleted_flag: true }
        });
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: 'Review deleted.',
            data: null
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteReview = deleteReview;
