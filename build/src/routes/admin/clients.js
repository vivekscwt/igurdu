"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const express_1 = require("express");
const client_1 = require("../../controllers/admin/client");
const routes = (0, express_1.Router)();
routes.get('/', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.QUERY]: celebrate_1.Joi.object({
        page: celebrate_1.Joi.number().positive().default(1),
        limit: celebrate_1.Joi.number().positive().default(10).max(100),
        order_by: celebrate_1.Joi.string(),
        status: celebrate_1.Joi.string(),
    })
}), client_1.getAllClients);
exports.default = routes;
