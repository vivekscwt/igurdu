import { Router } from 'express';
import {
  authorizeClient,
  authorizeRequest
} from '../../middlewares/authorization';

import auth from './auth';
import jobs from './jobs'
import dashboard from './dashboard';
import applications from './application';
import reviews from './reviews'
// import profile from './profile';

const routes = Router();

routes.use(auth);

routes.use(authorizeRequest)
routes.use(authorizeClient)

routes.use('/dashboard', dashboard);
routes.use('/jobs', jobs);
routes.use('/application', applications);
routes.use('/review', reviews);
// routes.use('/profile',  profile);



export default routes;