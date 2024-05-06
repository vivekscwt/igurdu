"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const express_1 = require("express");
const auth_1 = require("../../controllers/guard/auth");
const routes = (0, express_1.Router)();
routes.post('/register', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object({
        email: celebrate_1.Joi.string().email().optional(),
        password: celebrate_1.Joi.string().optional(),
        first_name: celebrate_1.Joi.string().optional(),
        last_name: celebrate_1.Joi.string().optional(),
        phone: celebrate_1.Joi.string().optional(),
        professionalDetails: celebrate_1.Joi.object({
            operation_type: celebrate_1.Joi.string().allow(null, ''),
            trading_name: celebrate_1.Joi.string().allow(null, ''),
            registered_company_name: celebrate_1.Joi.string().allow(null, ''),
            company_reg_no: celebrate_1.Joi.string().allow(null, ''),
            fullNames_of_partners: celebrate_1.Joi.string().allow(null, ''),
        }).optional(),
        location: celebrate_1.Joi.object({
            address: celebrate_1.Joi.string().required(),
            lat: celebrate_1.Joi.number().required(),
            lng: celebrate_1.Joi.number().required(),
            max_distance: celebrate_1.Joi.number().required(),
        }).optional(),
        siaNumber: celebrate_1.Joi.string().pattern(/^\d+$/).length(16).required(),
        expiryDateFrom: celebrate_1.Joi.date(),
        expiryDateTo: celebrate_1.Joi.date(),
        licenseSector: celebrate_1.Joi.string(),
        role: celebrate_1.Joi.string(),
        description: celebrate_1.Joi.string(),
        lookingFor: celebrate_1.Joi.array().items(celebrate_1.Joi.string()),
        tc: celebrate_1.Joi.bool().default(false),
        news: celebrate_1.Joi.bool().default(false)
    })
}), auth_1.registerGuard);
exports.default = routes;
