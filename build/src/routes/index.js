"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const guard_1 = __importDefault(require("./guard"));
const client_1 = __importDefault(require("./client"));
const admin_1 = __importDefault(require("./admin"));
const routes = (0, express_1.Router)();
routes.use('/auth', auth_1.default);
routes.use('/guard', guard_1.default);
routes.use('/client', client_1.default);
routes.use('/admin', admin_1.default);
exports.default = routes;
