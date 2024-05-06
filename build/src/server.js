"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const assert_1 = require("assert");
const celebrate_1 = require("celebrate");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const Error_Lib_1 = __importDefault(require("./libs/Error.Lib"));
const Logger_Lib_1 = __importDefault(require("./libs/Logger.Lib"));
const Response_Lib_1 = __importDefault(require("./libs/Response.Lib"));
const http_1 = __importDefault(require("http"));
const express_http_context_1 = __importDefault(require("express-http-context"));
const uuid_1 = require("uuid");
const DBAdapter_1 = __importDefault(require("./adapters/DBAdapter"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.set('trust proxy', true);
app.use((0, cors_1.default)({ exposedHeaders: ['access-token'] }));
app.use(express_1.default.json());
app.use(express_http_context_1.default.middleware);
app.use((req, res, next) => {
    express_http_context_1.default.set('request-id', (0, uuid_1.v4)().toString());
    Logger_Lib_1.default.log('API Request:', {
        url: req.url, method: req.method, request: req.body
    });
    next();
});
app.get('/', (req, res) => new Response_Lib_1.default(req, res).status(200).json({ message: 'OK!' }));
app.get('/health', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield new DBAdapter_1.default().raw('SELECT NOW() AS now');
        new Response_Lib_1.default(req, res).status(200).json({ message: 'OK!', timestamp: data[0].now });
    }
    catch (error) {
        next(error);
    }
}));
app.use('/api/v1', routes_1.default);
app.use((req, res) => {
    new Response_Lib_1.default(req, res).status(404).json({ message: 'Not Found' });
});
app.use((err, req, res, next) => {
    Logger_Lib_1.default.error(err);
    let message = 'Server Error', statusCode = 500;
    if (err instanceof Error_Lib_1.default) {
        message = err.message;
        statusCode = err.code;
    }
    else if (err instanceof celebrate_1.CelebrateError) {
        message = err.details.entries().next().value[1].details[0].message.replace(/["]+/g, '').replace(/_/g, ' ');
        statusCode = 400;
    }
    else if (err instanceof assert_1.AssertionError) {
        message = err.message;
        statusCode = 400;
    }
    new Response_Lib_1.default(req, res).status(statusCode).json({ success: false, message });
});
module.exports = server;
