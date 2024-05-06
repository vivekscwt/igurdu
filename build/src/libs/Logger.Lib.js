"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_http_context_1 = __importDefault(require("express-http-context"));
const pino_1 = __importDefault(require("pino"));
const pino_pretty_1 = __importDefault(require("pino-pretty"));
const stream = process.env.NODE_ENV === 'local' ? (0, pino_pretty_1.default)({ colorize: true, singleLine: true }) : undefined;
const logger = (0, pino_1.default)({
    messageKey: 'message',
    redact: ['*.new_password', '*.*.new_password', '*.password', '*.*.password', '*.otp', '*.*.otp']
}, stream);
class LoggerLib {
    static log(message, data, ...args) {
        const user = express_http_context_1.default.get('user');
        logger.info({
            'name': process.env.APP_NAME,
            message,
            'request-id': express_http_context_1.default.get('request-id'),
            user,
            data,
            args
        });
    }
    static error(err, data, ...args) {
        const user = express_http_context_1.default.get('user');
        logger.error({
            'name': process.env.APP_NAME,
            err,
            'request-id': express_http_context_1.default.get('request-id'),
            user,
            data,
            args
        });
    }
}
exports.default = LoggerLib;
