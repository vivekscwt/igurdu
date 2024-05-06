"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const licenses_1 = require("../../controllers/guard/licenses");
const celebrate_1 = require("celebrate");
const routes = (0, express_1.Router)();
routes.post('/create', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object({
        siaNumber: celebrate_1.Joi.string().pattern(/^\d+$/).length(16).required(),
        expiryDateFrom: celebrate_1.Joi.date(),
        expiryDateTo: celebrate_1.Joi.date(),
        licenseSector: celebrate_1.Joi.string(),
        role: celebrate_1.Joi.string(),
        trades: celebrate_1.Joi.array().items(celebrate_1.Joi.string())
    })
}), licenses_1.createLicense);
routes.get('/list', licenses_1.getLicense);
routes.patch('/update', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object({
        id: celebrate_1.Joi.number().positive(),
        trades: celebrate_1.Joi.array().items(celebrate_1.Joi.string())
    })
}), licenses_1.updateLicense);
exports.default = routes;
