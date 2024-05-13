import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { registerGuard } from '../../controllers/guard/auth';

const routes = Router();

routes.post(
  '/register',
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().optional(),
      password: Joi.string().optional(),
      first_name: Joi.string().optional(),
      last_name: Joi.string().optional(),
      phone: Joi.string().optional(),
      country_code: Joi.string().optional(),
      professionalDetails: Joi.object({
        operation_type: Joi.string().allow(null, ''),
        trading_name: Joi.string().allow(null, ''),
        registered_company_name: Joi.string().allow(null, ''),
        company_reg_no: Joi.string().allow(null, ''),
        fullNames_of_partners: Joi.string().allow(null, ''),
      }).optional(),
      location: Joi.object({
        address: Joi.string().required(),
        lat: Joi.number().required(),
        lng: Joi.number().required(),
        max_distance: Joi.number().required(),
      }).optional(),
      siaNumber:  Joi.string().pattern(/^\d+$/).length(16).required(),
      expiryDateFrom: Joi.date(),
      expiryDateTo: Joi.date(),
      licenseSector: Joi.string(),
      role: Joi.string(),
      description: Joi.string(),
      lookingFor: Joi.array().items(Joi.string()),
      tc: Joi.bool().default(false),
      news: Joi.bool().default(false)
    })
  }),
  registerGuard
)

export default routes;