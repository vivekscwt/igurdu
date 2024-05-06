"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_Lib_1 = __importDefault(require("../libs/Logger.Lib"));
const express_http_context_1 = __importDefault(require("express-http-context"));
class ResponseLib {
    constructor(_req, _res) {
        this._req = _req;
        this._res = _res;
    }
    status(statuscode) {
        this._res.status(statuscode);
        return this;
    }
    json(data) {
        var _a;
        this._res.statusCode = (_a = this._res.statusCode) !== null && _a !== void 0 ? _a : 200;
        Logger_Lib_1.default.log('API Response:', {
            url: this._req.url,
            method: this._req.method,
            status: this._res.statusCode,
            response: data
        });
        this._res.set('X-Request-ID', express_http_context_1.default.get('request-id'));
        this._res.json(data);
        return this;
    }
    setHeader(data) {
        for (const key in data) {
            this._res.set(key, data[key]);
        }
        return this;
    }
}
exports.default = ResponseLib;
