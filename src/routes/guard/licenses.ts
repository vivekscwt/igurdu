import { Router } from 'express';
import { createLicense, getLicense, updateLicense } from '../../controllers/guard/licenses';
import { Joi, Segments, celebrate } from 'celebrate';

const routes = Router();

routes.post('/create',
  celebrate({
    [Segments.BODY]: Joi.object({
      siaNumber:  Joi.string().pattern(/^\d+$/).length(16).required(),
      expiryDateFrom: Joi.date(),
      expiryDateTo: Joi.date(),
      licenseSector: Joi.string(),
      role: Joi.string(),
      trades: Joi.array().items(Joi.string())
    })
  }),  
  createLicense
)
routes.get('/list', getLicense)
routes.patch('/update',
  celebrate({
    [Segments.BODY]: Joi.object({
      id: Joi.number().positive(),
      trades: Joi.array().items(Joi.string())
    })
  }),
  updateLicense)

export default routes;