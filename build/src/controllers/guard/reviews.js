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
exports.getReviews = void 0;
const Response_Lib_1 = __importDefault(require("../../libs/Response.Lib"));
const DBAdapter_1 = __importDefault(require("../../adapters/DBAdapter"));
const Review_entity_1 = require("../../db/entities/Review.entity");
// get reviews aggregates.
// export const reviewsAggregate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
//   try {
//     const user = req.user;
//     const db = new DBAdapter();
//     const response = await db.raw(`
//       SELECT
//         AVG(rating) AS average_rating,
//         COUNT(*) AS number_of_ratings
//         SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS five_star,
//         SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS four_star,
//         SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS three_star,
//         SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS two_star,
//         SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS one_star
//       FROM ratings
//       WHERE guard_id = $1
//     `, [user.id]);
//     return new ResponseLib(req, res).json({
//       success: true,
//       message: "Successfully fetched rate aggregates.",
//       data: response
//     })
//   } catch (error) {
//     next(error)
//   }
// }
const getReviews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const db = new DBAdapter_1.default();
        const { page, limit } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const star_average = yield db.raw(`
      SELECT
          COALESCE(AVG(rating), 0) AS average_rating,
          COUNT(*) AS number_of_ratings,
          COALESCE(SUM(CASE WHEN ROUND(rating) = 5 THEN 1 ELSE 0 END), 0) AS five_star,
          COALESCE(SUM(CASE WHEN ROUND(rating) = 4 THEN 1 ELSE 0 END), 0) AS four_star,
          COALESCE(SUM(CASE WHEN ROUND(rating) = 3 THEN 1 ELSE 0 END), 0) AS three_star,
          COALESCE(SUM(CASE WHEN ROUND(rating) = 2 THEN 1 ELSE 0 END), 0) AS two_star,
          COALESCE(SUM(CASE WHEN ROUND(rating) = 1 THEN 1 ELSE 0 END), 0) AS one_star
      FROM reviews
      WHERE guard_id=${user.id}
    `);
        const response = yield db.find(Review_entity_1.Review, {
            where: {
                guard_id: user.id,
                meta: { deleted_flag: false }
            },
            skip,
            take: Number(limit),
            relations: {
                client: true,
            },
            order: { id: 'DESC' }
        });
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: "Successfully fetched rate aggregates.",
            data: { reviews: response, star_average: star_average[0] }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getReviews = getReviews;
