import { Router } from 'express';

import auth from './auth';
import guard from './guard';
import client from './client';
import admin from './admin'
import user from './auth'
const routes = Router();

routes.use('/auth', auth);
routes.use('/guard', guard);
routes.use('/client', client);
routes.use('/admin', admin);
routes.use('/user', user);


export default routes;
