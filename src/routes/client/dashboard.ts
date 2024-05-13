import { Router } from 'express';
import { dashboardCharts, clientDashboard } from '../../controllers/client/dashboard';

const routes = Router();

routes.get('/', clientDashboard)
routes.get('/charts', dashboardCharts)

export default routes;