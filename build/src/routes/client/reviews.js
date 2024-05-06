"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const express_1 = require("express");
const reviews_1 = require("../../controllers/client/reviews");
const routes = (0, express_1.Router)();
routes.post('/', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object({
        guard_id: celebrate_1.Joi.number().positive().required(),
        job_id: celebrate_1.Joi.number().positive().required(),
        rating: celebrate_1.Joi.number().positive().precision(2).required(),
        title: celebrate_1.Joi.string().required(),
        description: celebrate_1.Joi.string().required(),
        work_completed_at: celebrate_1.Joi.date().required()
    })
}), reviews_1.writeReviews);
routes.get('/', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.QUERY]: celebrate_1.Joi.object({
        page: celebrate_1.Joi.number().positive().default(1),
        limit: celebrate_1.Joi.number().positive().default(10).max(100)
    })
}), reviews_1.listReviews);
exports.default = routes;
