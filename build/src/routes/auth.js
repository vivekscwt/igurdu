"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const authorization_1 = require("../middlewares/authorization");
const profile_1 = require("../controllers/profile");
const routes = (0, express_1.Router)();
routes.post('/login', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object({
        email: celebrate_1.Joi.string().email().required(),
        password: celebrate_1.Joi.string().required(),
    })
}), auth_1.login);
routes.use(authorization_1.authorizeRequest);
routes.get('/me', profile_1.me);
routes.post('/verify', auth_1.verifyUser);
routes.use(authorization_1.authorizeAdmin);
routes.patch('/user/:id/update', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.PARAMS]: celebrate_1.Joi.object({
        id: celebrate_1.Joi.number().positive(),
    }),
    [celebrate_1.Segments.QUERY]: celebrate_1.Joi.object({
        status: celebrate_1.Joi.string(),
    })
}), profile_1.updateAccountStatus);
routes.delete('/user/:id/delete', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.PARAMS]: celebrate_1.Joi.object({
        id: celebrate_1.Joi.number().positive(),
    })
}), profile_1.deleteUser);
exports.default = routes;
