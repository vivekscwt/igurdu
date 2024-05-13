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
const redis_1 = require("redis");
const Logger_Lib_1 = __importDefault(require("./Logger.Lib"));
let client;
class RedisLib {
    static getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (client === null || client === void 0 ? void 0 : client.isOpen) {
                return client;
            }
            client = client || (0, redis_1.createClient)({ url: process.env.REDIS_URL });
            client.on('error', err => Logger_Lib_1.default.error('Redis Client Error', err));
            client.on('ready', _ => Logger_Lib_1.default.log('Redis Client Ready'));
            yield client.connect();
            return client;
        });
    }
}
exports.default = RedisLib;
RedisLib.getInstance();
