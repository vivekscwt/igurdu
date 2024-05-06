"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const express_1 = require("express");
const jobs_1 = require("../../controllers/admin/jobs");
const routes = (0, express_1.Router)();
routes.get('/', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.QUERY]: celebrate_1.Joi.object({
        page: celebrate_1.Joi.number().positive().default(1),
        limit: celebrate_1.Joi.number().positive().default(10).max(100),
        budget: celebrate_1.Joi.string(),
        created_at: celebrate_1.Joi.string(),
    })
}), jobs_1.getAllJobs);
routes.patch('/:id/update', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.PARAMS]: celebrate_1.Joi.object({
        id: celebrate_1.Joi.number().positive()
    }),
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object({
        status: celebrate_1.Joi.string()
    })
}), jobs_1.updateJobStatus);
exports.default = routes;
