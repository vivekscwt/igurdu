import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { registerClient } from '../../controllers/client/auth';
import { passAuth } from '../../middlewares/authorization';

const routes = Router();

routes.post(
  '/job/post',
  passAuth,
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email(),
      password: Joi.string(),
      first_name: Joi.string(),
      last_name: Joi.string(),
      phone: Joi.string(),
     
      jobTitle: Joi.string(),
      jobDescription: Joi.string(),
      location: Joi.object({
        address: Joi.string(),
        lat: Joi.number(),
        lng: Joi.number(),
      }),
      quantity: Joi.number().positive(),
      startDateTime: Joi.array().items({
        date: Joi.date(),
        fromTime: Joi.date(),
        toTime: Joi.date()
      }),
      maxBudget: Joi.number().positive(),
      lookingFor: Joi.array().items(Joi.string())
    })
  }),
  registerClient
)

export default routes;