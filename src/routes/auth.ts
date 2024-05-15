import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { login, verifyUser, getResetPasswordLink, resetPassword } from '../controllers/auth';
import { IAuthLoginRequest } from '../interfaces/requests/auth.request.interface';
import { authorizeAdmin, authorizeRequest } from '../middlewares/authorization';
import { deleteUser, me, updateAccountStatus } from '../controllers/profile';

const routes = Router();

routes.post(
  '/login',
  celebrate({
    [Segments.BODY]: Joi.object<IAuthLoginRequest, true>({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    })
  }),
  login
)

// Reset password Link generation
routes.post('/forget-password', getResetPasswordLink)


routes.use(authorizeRequest);
routes.get('/me', me);

routes.post('/verify', verifyUser);

routes.use(authorizeAdmin);

routes.patch('/user/:id/update',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().positive(),
    }),
    [Segments.QUERY]: Joi.object({
      status: Joi.string(),
    })
  }),
updateAccountStatus)


routes.delete('/user/:id/delete',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().positive(),
    })
  }),
  deleteUser)
//Reset password 
routes.post('/reset-password', resetPassword)


export default routes;
