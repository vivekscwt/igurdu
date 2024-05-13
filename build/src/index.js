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
require("dotenv/config");
const bootstrap_1 = __importDefault(require("./bootstrap"));
const server_1 = __importDefault(require("./server"));
const Logger_Lib_1 = __importDefault(require("./libs/Logger.Lib"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, bootstrap_1.default)();
    const listener = server_1.default.listen(process.env.PORT, function () {
        const address = listener.address();
        const binding = typeof address === 'string' ? `pipe/socket ${address}` : `port :${address === null || address === void 0 ? void 0 : address.port}`;
        Logger_Lib_1.default.log(`${process.env.APP_NAME} Server running on ${binding}, env ${process.env.NODE_ENV}`);
    });
}))();
