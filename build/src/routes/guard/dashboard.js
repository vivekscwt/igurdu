"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_1 = require("../../controllers/guard/dashboard");
const routes = (0, express_1.Router)();
routes.get('/', dashboard_1.guardDashboard);
exports.default = routes;
