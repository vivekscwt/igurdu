import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { getAllClients } from '../../controllers/admin/client';

const routes = Router();

routes.get('/',
  celebrate({
    [Segments.QUERY]: Joi.object({ 
      page: Joi.number().positive().default(1),
      limit: Joi.number().positive().default(10).max(100),
      order_by: Joi.string(),
      status: Joi.string(),
    })
  }), 
getAllClients)

export default routes;