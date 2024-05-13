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
const Logger_Lib_1 = __importDefault(require("../libs/Logger.Lib"));
const Redis_Lib_1 = __importDefault(require("../libs/Redis.Lib"));
class CacheAdapter {
    constructor() {
        this.cacheInstance = null;
    }
    getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_Lib_1.default.log('getInstance');
            if (!this.cacheInstance)
                this.cacheInstance = yield Redis_Lib_1.default.getInstance();
            return this.cacheInstance;
        });
    }
    set(key, value, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_Lib_1.default.log('set', value, ttl);
            const instance = yield this.getInstance();
            const set = yield instance[typeof value === 'object' ? 'HSET' : 'set'](key, value);
            if (ttl)
                yield instance.expire(key, ttl);
            return set;
        });
    }
    get(key, field) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_Lib_1.default.log('get');
            const instance = yield this.getInstance();
            let value;
            if (field === '*')
                value = yield instance.HGETALL(key);
            else if (Array.isArray(field))
                value = yield instance.HMGET(key, field);
            else if (field)
                value = yield instance.HGET(key, field);
            else
                value = yield instance.get(key);
            return value;
        });
    }
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = yield this.getInstance();
            return instance.del(key);
        });
    }
}
exports.default = CacheAdapter;
