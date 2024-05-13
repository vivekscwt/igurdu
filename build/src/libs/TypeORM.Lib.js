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
const datasource_config_1 = require("../db/datasource.config");
const Logger_Lib_1 = __importDefault(require("./Logger.Lib"));
class TypeORMLib {
    static getInstance() {
        return __awaiter(this, arguments, void 0, function* (dbName = process.env.DATABASE_NAME) {
            const datasource = datasource_config_1.ClientDataSource;
            if (datasource.isInitialized) {
                return datasource;
            }
            yield datasource.initialize();
            Logger_Lib_1.default.log('DB Client Ready');
            return datasource;
        });
    }
}
exports.default = TypeORMLib;
TypeORMLib.getInstance();
