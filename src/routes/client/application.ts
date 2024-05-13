import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { inviteToApply, getJobApplications, applicationsAnalytics } from '../../controllers/client/applications';
import { updateApplications } from '../../controllers/client/applications';

const routes = Router();

routes.get('/:id/:status/list',
  celebrate({
    [Segments.QUERY]: Joi.object({ 
      page: Joi.number().positive().default(1),
      limit: Joi.number().positive().default(10).max(100),
    }),
    [Segments.PARAMS]: Joi.object({
      status: Joi.string().required(),
      id: Joi.number().positive().required()
    })
  }), 
  getJobApplications
)

routes.post('/invite',
  celebrate({
    [Segments.BODY]: Joi.object({ 
      job_id: Joi.number().positive(),
      guard_id: Joi.number().positive(),
      status: Joi.string()
    })
  }),  
  inviteToApply
)

routes.patch('/:application_id/update',
  celebrate({
    [Segments.QUERY]: Joi.object({ 
      page: Joi.number().positive().default(1),
      limit: Joi.number().positive().default(10).max(100),
    }),
    [Segments.BODY]: Joi.object({
      status: Joi.string().required(),
      guard_id: Joi.number().positive()
    })
  }), 
  updateApplications
)

routes.get('/:id/analytics', applicationsAnalytics)


export default routes;