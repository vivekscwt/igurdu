"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const express_1 = require("express");
const reviews_1 = require("../../controllers/guard/reviews");
const routes = (0, express_1.Router)();
routes.get('/', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.QUERY]: celebrate_1.Joi.object({
        page: celebrate_1.Joi.number().positive().default(1),
        limit: celebrate_1.Joi.number().positive().default(10).max(100),
    })
}), reviews_1.getReviews);
exports.default = routes;
