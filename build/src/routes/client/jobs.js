"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const express_1 = require("express");
const jobs_1 = require("../../controllers/client/jobs");
const routes = (0, express_1.Router)();
routes.get('/list', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.QUERY]: celebrate_1.Joi.object({
        page: celebrate_1.Joi.number().positive().default(1),
        limit: celebrate_1.Joi.number().positive().default(10).max(100),
        budget: celebrate_1.Joi.string(),
        created_at: celebrate_1.Joi.string()
    })
}), jobs_1.listJobs);
routes.get('/:id/find-guards', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.QUERY]: celebrate_1.Joi.object({
        page: celebrate_1.Joi.number().positive().default(1),
        limit: celebrate_1.Joi.number().positive().default(10).max(100)
    })
}), jobs_1.findGuards);
exports.default = routes;
