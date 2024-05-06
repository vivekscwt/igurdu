"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const express_1 = require("express");
const profile_1 = require("../../controllers/guard/profile");
const routes = (0, express_1.Router)();
routes.get('/', profile_1.getProfile);
routes.patch('/', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object({
        email: celebrate_1.Joi.string().email().optional(),
        password: celebrate_1.Joi.string().optional(),
        first_name: celebrate_1.Joi.string().optional(),
        last_name: celebrate_1.Joi.string().optional(),
        phone: celebrate_1.Joi.string().optional(),
        documents: celebrate_1.Joi.array().items(celebrate_1.Joi.allow(null)),
        professionalDetails: celebrate_1.Joi.object({
            operation_type: celebrate_1.Joi.string().allow(null, ''),
            trading_name: celebrate_1.Joi.string().allow(null, ''),
            registered_company_name: celebrate_1.Joi.string().allow(null, ''),
            company_reg_no: celebrate_1.Joi.string().allow(null, ''),
            fullNames_of_partners: celebrate_1.Joi.string().allow(null, ''),
        }).optional(),
        location: celebrate_1.Joi.object({
            address: celebrate_1.Joi.string(),
            lat: celebrate_1.Joi.number(),
            lng: celebrate_1.Joi.number(),
            max_distance: celebrate_1.Joi.number(),
        }).optional(),
        siaNumber: celebrate_1.Joi.string().pattern(/^\d+$/).length(16),
        expiryDateFrom: celebrate_1.Joi.date(),
        expiryDateTo: celebrate_1.Joi.date(),
        licenseSector: celebrate_1.Joi.string(),
        role: celebrate_1.Joi.string(),
        description: celebrate_1.Joi.string(),
        lookingFor: celebrate_1.Joi.array().items(celebrate_1.Joi.string()),
    })
}), profile_1.updateProfile);
exports.default = routes;
