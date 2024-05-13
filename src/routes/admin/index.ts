import { Router } from 'express';
import {
  authorizeAdmin,
  authorizeRequest
} from '../../middlewares/authorization';

// import auth from './auth';
import jobs from './jobs'
import dashboard from './dashboard';
import guards from './guards';
import clients from './clients'
import reviews from './reviews';

const routes = Router();

routes.use(authorizeRequest)
routes.use(authorizeAdmin)

routes.use('/dashboard', dashboard);
routes.use('/guards', guards);
routes.use('/clients', clients);
routes.use('/jobs', jobs);
routes.use('/reviews',  reviews);



export default routes;