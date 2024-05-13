"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const express_1 = require("express");
const applications_1 = require("../../controllers/guard/applications");
const authorization_1 = require("../../middlewares/authorization");
const routes = (0, express_1.Router)();
routes.use(authorization_1.authorizeRequest);
routes.post('/apply', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object({
        job_id: celebrate_1.Joi.number().required()
    })
}), applications_1.applyJobs);
routes.get('/analytics', applications_1.applicationsAnalytics);
routes.get('/:status', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.QUERY]: celebrate_1.Joi.object({
        page: celebrate_1.Joi.number().positive().default(1),
        limit: celebrate_1.Joi.number().positive().default(10).max(100),
    })
}), applications_1.getApplications);
routes.patch('/:job_id', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.PARAMS]: celebrate_1.Joi.object({
        job_id: celebrate_1.Joi.number().positive().required(),
    }),
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object({
        status: celebrate_1.Joi.string().required(),
    })
}), applications_1.updateApplications);
exports.default = routes;
