import express from 'express';
import ResponseLib from '../../libs/Response.Lib';
import DBAdapter from '../../adapters/DBAdapter';
import { Review } from '../../db/entities/Review.entity';

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


export const getReviews = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const user = req.user;
    const db = new DBAdapter();
    const { page, limit } = req.query; 
    const skip = (Number(page) - 1) * Number(limit);

    const star_average = await db.raw(`
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

    const response = await db.find(Review, {
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
    })

    return new ResponseLib(req, res).json({
      success: true,
      message: "Successfully fetched rate aggregates.",
      data: { reviews: response, star_average: star_average[0] }
    })
  } catch (error) {
    next(error)
  }
}