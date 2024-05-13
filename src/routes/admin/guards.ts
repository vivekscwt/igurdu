import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { getAllGuards, updateLicenseStatus } from '../../controllers/admin/guards';

const routes = Router();

routes.get('/',
  celebrate({
    [Segments.QUERY]: Joi.object({ 
      page: Joi.number().positive().default(1),
      limit: Joi.number().positive().default(10).max(100),
      status: Joi.string(),
      account_status: Joi.string(),
      expiry: Joi.string()
    })
  }), 
getAllGuards)

routes.patch('/:id/license-update',
  celebrate({
    [Segments.BODY]: Joi.object({ 
      status: Joi.string(),
    }),
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().positive().required()
    })
  }), 
updateLicenseStatus)

export default routes;