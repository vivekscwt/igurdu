import { Router } from 'express';
import { adminDashboard, dashboardCharts } from '../../controllers/admin/dashboard';

const routes = Router();

routes.get('/', adminDashboard)
routes.get('/charts', dashboardCharts)

export default routes;