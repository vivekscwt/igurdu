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
const datasource_config_1 = require("./db/datasource.config");
const server_1 = __importDefault(require("./server"));
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        process.env.TZ = 'UTC'; // check/set timezone as per business/tech requirement.
        process.env.PORT = process.env.PORT || '80';
        process.env.APP_NAME = process.env.APP_NAME || 'APP';
        process.env.NODE_ENV = process.env.NODE_ENV || 'development';
        yield datasource_config_1.ClientDataSource.initialize();
        return server_1.default;
    });
}
exports.default = bootstrap;
