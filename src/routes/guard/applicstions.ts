import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { applicationsAnalytics, applyJobs, getApplications, updateApplications } from '../../controllers/guard/applications';
import { authorizeRequest } from '../../middlewares/authorization';


const routes = Router();
routes.use(authorizeRequest)

routes.post('/apply',
celebrate({
  [Segments.BODY]: Joi.object({
      job_id: Joi.number().required()
    })
  }),
applyJobs)

routes.get('/analytics', applicationsAnalytics)

routes.get('/:status',
  celebrate({
    [Segments.QUERY]: Joi.object({
      page: Joi.number().positive().default(1),
      limit: Joi.number().positive().default(10).max(100),
    })
  }),
getApplications)


routes.patch('/:job_id',
celebrate({
  [Segments.PARAMS]: Joi.object({
    job_id: Joi.number().positive().required(),
  }),
  [Segments.BODY]: Joi.object({
    status: Joi.string().required(),
  })
}),
updateApplications)


export default routes;