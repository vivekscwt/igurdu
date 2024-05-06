import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { getAllReviews, deleteReview } from '../../controllers/admin/reviews';

const routes = Router();

routes.get('/',
  celebrate({
    [Segments.QUERY]: Joi.object({ 
      page: Joi.number().positive().default(1),
      limit: Joi.number().positive().default(10).max(100)
    })
  }), 
  getAllReviews)

routes.delete('/:id/',
  celebrate({
    [Segments.PARAMS]: Joi.object({ 
      id: Joi.number().positive()
    })
  }),
  deleteReview)

export default routes;