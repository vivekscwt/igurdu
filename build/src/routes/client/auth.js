"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const express_1 = require("express");
const auth_1 = require("../../controllers/client/auth");
const authorization_1 = require("../../middlewares/authorization");
const routes = (0, express_1.Router)();
routes.post('/job/post', authorization_1.passAuth, (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object({
        email: celebrate_1.Joi.string().email(),
        password: celebrate_1.Joi.string(),
        first_name: celebrate_1.Joi.string(),
        last_name: celebrate_1.Joi.string(),
        phone: celebrate_1.Joi.string(),
        jobTitle: celebrate_1.Joi.string(),
        jobDescription: celebrate_1.Joi.string(),
        location: celebrate_1.Joi.object({
            address: celebrate_1.Joi.string(),
            lat: celebrate_1.Joi.number(),
            lng: celebrate_1.Joi.number(),
        }),
        quantity: celebrate_1.Joi.number().positive(),
        startDateTime: celebrate_1.Joi.array().items({
            date: celebrate_1.Joi.date(),
            fromTime: celebrate_1.Joi.date(),
            toTime: celebrate_1.Joi.date()
        }),
        maxBudget: celebrate_1.Joi.number().positive(),
        lookingFor: celebrate_1.Joi.array().items(celebrate_1.Joi.string())
    })
}), auth_1.registerClient);
exports.default = routes;
