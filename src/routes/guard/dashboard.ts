import { Router } from 'express';
import { guardDashboard } from '../../controllers/guard/dashboard';

const routes = Router();

routes.get('/', guardDashboard)

export default routes;