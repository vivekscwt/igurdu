import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { registerGuard } from '../../controllers/guard/auth';
import { getProfile, updateProfile } from '../../controllers/guard/profile';

const routes = Router();

routes.get('/', getProfile)


routes.patch(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().optional(),
      password: Joi.string().optional(),
      first_name: Joi.string().optional(),
      last_name: Joi.string().optional(),
      phone: Joi.string().optional(),
      documents: Joi.array().items(Joi.allow(null)),
      professionalDetails: Joi.object({
        operation_type: Joi.string().allow(null, ''),
        trading_name: Joi.string().allow(null, ''),
        registered_company_name: Joi.string().allow(null, ''),
        company_reg_no: Joi.string().allow(null, ''),
        fullNames_of_partners: Joi.string().allow(null, ''),
      }).optional(),
      location: Joi.object({
        address: Joi.string(),
        lat: Joi.number(),
        lng: Joi.number(),
        max_distance: Joi.number(),
      }).optional(),
      siaNumber:  Joi.string().pattern(/^\d+$/).length(16),
      expiryDateFrom: Joi.date(),
      expiryDateTo: Joi.date(),
      licenseSector: Joi.string(),
      role: Joi.string(),
      description: Joi.string(),
      lookingFor: Joi.array().items(Joi.string()),
    })
  }),
  updateProfile
)

export default routes;