import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { myJobs } from '../../controllers/guard/applications';
import { authorizeRequest } from '../../middlewares/authorization';


const routes = Router();
routes.use(authorizeRequest)

routes.get('/search', myJobs)

export default routes;