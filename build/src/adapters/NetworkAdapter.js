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
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const Logger_Lib_1 = __importDefault(require("../libs/Logger.Lib"));
class NetworkAdapter {
    constructor(baseUrl, config) {
        this.baseUrl = baseUrl;
        this.config = config;
    }
    getConfig(headers = {}) {
        var _a;
        const config = Object.assign(Object.assign({ baseURL: this.baseUrl }, this.config), { headers: Object.assign(Object.assign({}, (((_a = this.config) === null || _a === void 0 ? void 0 : _a.headers) || {})), headers), timeout: 60000 });
        config.headers['content-type'] = config.headers['content-type'] || 'application/json';
        config.headers['accept-encoding'] = config.headers['accept-encoding'] || 'identity';
        return config;
    }
    get(url_1) {
        return __awaiter(this, arguments, void 0, function* (url, headers = {}) {
            var _a;
            try {
                Logger_Lib_1.default.log(`Request GET ${this.baseUrl} ${url}`);
                const response = yield axios_1.default.get(`${url}`, this.getConfig(headers));
                Logger_Lib_1.default.log(`Response GET ${this.baseUrl} ${url}`, response.data);
                return response.data;
            }
            catch (error) {
                Logger_Lib_1.default.error(error.message, (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data);
                throw error;
            }
        });
    }
    post(url_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (url, data, headers = {}) {
            var _a;
            try {
                Logger_Lib_1.default.log(`Request POST ${this.baseUrl} ${url}`, data);
                const response = yield axios_1.default.post(`${url}`, data, this.getConfig(headers));
                Logger_Lib_1.default.log(`Response POST ${this.baseUrl} ${url}`, response.data);
                return response.data;
            }
            catch (error) {
                Logger_Lib_1.default.error(error.message, (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data);
                throw error;
            }
        });
    }
}
exports.default = NetworkAdapter;
