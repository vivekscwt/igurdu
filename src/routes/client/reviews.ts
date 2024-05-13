import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { listReviews, writeReviews } from '../../controllers/client/reviews';

const routes = Router();

routes.post('/',
  celebrate({
    [Segments.BODY]: Joi.object({
      guard_id: Joi.number().positive().required(),
      job_id: Joi.number().positive().required(),
      rating: Joi.number().positive().precision(2).required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      work_completed_at: Joi.date().required()
    })
  }), 
  writeReviews)

routes.get('/',
  celebrate({
    [Segments.QUERY]: Joi.object({
      page: Joi.number().positive().default(1),
      limit: Joi.number().positive().default(10).max(100)
    })
  }), 
  listReviews)

export default routes;