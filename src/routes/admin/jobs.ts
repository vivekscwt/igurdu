import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { getAllJobs, updateJobStatus } from '../../controllers/admin/jobs';

const routes = Router();

routes.get('/',
  celebrate({
    [Segments.QUERY]: Joi.object({ 
      page: Joi.number().positive().default(1),
      limit: Joi.number().positive().default(10).max(100),
      budget: Joi.string(),
      created_at: Joi.string(),
    })
  }), 
getAllJobs)



routes.patch('/:id/update',
  celebrate({
    [Segments.PARAMS]: Joi.object({ 
      id: Joi.number().positive()
    }),
    [Segments.BODY]: Joi.object({ 
      status: Joi.string()
    })
  }), 
updateJobStatus)

export default routes;