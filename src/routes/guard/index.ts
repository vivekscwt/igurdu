import { Router } from 'express';
import {
  authorizeGuard,
  authorizeRequest
} from '../../middlewares/authorization';

import auth from './auth';
import profile from './profile';
import dashboard from './dashboard';
import applications from './applicstions';
import jobs from './jobs';
import license from './licenses'
import reviews from './reviews'

const routes = Router();

routes.use(auth);

routes.use(authorizeRequest)
routes.use(authorizeGuard)

routes.use('/profile',  profile);
routes.use('/dashboard', dashboard);
routes.use('/application', applications);
routes.use('/jobs', jobs);
routes.use('/license', license);
routes.use('/review', reviews);



export default routes;