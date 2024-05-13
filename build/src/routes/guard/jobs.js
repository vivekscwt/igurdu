"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const applications_1 = require("../../controllers/guard/applications");
const authorization_1 = require("../../middlewares/authorization");
const routes = (0, express_1.Router)();
routes.use(authorization_1.authorizeRequest);
routes.get('/search', applications_1.myJobs);
exports.default = routes;
