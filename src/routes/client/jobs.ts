import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { findGuards, listJobs } from '../../controllers/client/jobs';

const routes = Router();

routes.get('/list',
  celebrate({
    [Segments.QUERY]: Joi.object({
      page: Joi.number().positive().default(1),
      limit: Joi.number().positive().default(10).max(100),
      budget: Joi.string(),
      created_at: Joi.string()
    })
  }), 
  listJobs)

routes.get('/:id/find-guards',
  celebrate({
    [Segments.QUERY]: Joi.object({
      page: Joi.number().positive().default(1),
      limit: Joi.number().positive().default(10).max(100)
    })
  }), 
  findGuards)

export default routes;