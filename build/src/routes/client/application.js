"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const express_1 = require("express");
const applications_1 = require("../../controllers/client/applications");
const applications_2 = require("../../controllers/client/applications");
const routes = (0, express_1.Router)();
routes.get('/:id/:status/list', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.QUERY]: celebrate_1.Joi.object({
        page: celebrate_1.Joi.number().positive().default(1),
        limit: celebrate_1.Joi.number().positive().default(10).max(100),
    }),
    [celebrate_1.Segments.PARAMS]: celebrate_1.Joi.object({
        status: celebrate_1.Joi.string().required(),
        id: celebrate_1.Joi.number().positive().required()
    })
}), applications_1.getJobApplications);
routes.post('/invite', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object({
        job_id: celebrate_1.Joi.number().positive(),
        guard_id: celebrate_1.Joi.number().positive(),
        status: celebrate_1.Joi.string()
    })
}), applications_1.inviteToApply);
routes.patch('/:application_id/update', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.QUERY]: celebrate_1.Joi.object({
        page: celebrate_1.Joi.number().positive().default(1),
        limit: celebrate_1.Joi.number().positive().default(10).max(100),
    }),
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object({
        status: celebrate_1.Joi.string().required(),
        guard_id: celebrate_1.Joi.number().positive()
    })
}), applications_2.updateApplications);
routes.get('/:id/analytics', applications_1.applicationsAnalytics);
exports.default = routes;
