"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_1 = require("../../controllers/client/dashboard");
const routes = (0, express_1.Router)();
routes.get('/', dashboard_1.clientDashboard);
routes.get('/charts', dashboard_1.dashboardCharts);
exports.default = routes;
