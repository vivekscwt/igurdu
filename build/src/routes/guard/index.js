"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authorization_1 = require("../../middlewares/authorization");
const auth_1 = __importDefault(require("./auth"));
const profile_1 = __importDefault(require("./profile"));
const dashboard_1 = __importDefault(require("./dashboard"));
const applicstions_1 = __importDefault(require("./applicstions"));
const jobs_1 = __importDefault(require("./jobs"));
const licenses_1 = __importDefault(require("./licenses"));
const reviews_1 = __importDefault(require("./reviews"));
const routes = (0, express_1.Router)();
routes.use(auth_1.default);
routes.use(authorization_1.authorizeRequest);
routes.use(authorization_1.authorizeGuard);
routes.use('/profile', profile_1.default);
routes.use('/dashboard', dashboard_1.default);
routes.use('/application', applicstions_1.default);
routes.use('/jobs', jobs_1.default);
routes.use('/license', licenses_1.default);
routes.use('/review', reviews_1.default);
exports.default = routes;
