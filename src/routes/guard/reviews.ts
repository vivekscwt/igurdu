import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { getReviews } from '../../controllers/guard/reviews';

const routes = Router();

routes.get('/',
celebrate({
  [Segments.QUERY]: Joi.object({
    page: Joi.number().positive().default(1),
    limit: Joi.number().positive().default(10).max(100),
  })
}),
getReviews)

export default routes;