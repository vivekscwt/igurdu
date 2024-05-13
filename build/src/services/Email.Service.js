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
const email_1 = __importDefault(require("../apis/email"));
const Logger_Lib_1 = __importDefault(require("../libs/Logger.Lib"));
const Error_Lib_1 = require("../libs/Error.Lib");
class EmailService {
    constructor(user, email) {
        this.user = user;
        this.email = email;
    }
    send() {
        return __awaiter(this, arguments, void 0, function* (data = {}) {
            try {
                const message = {
                    from: `Iguardu Security  <${process.env.EMAIL}>`,
                    to: `${this.user.email}`,
                    subject: data.subject,
                    html: data.html,
                };
                //LoggerLib.log('Email Service', { ...this.user })
                yield email_1.default.sendMail(message);
                //LoggerLib.log('Email out - ', { ...data, user: this.user })
                return true;
                //console.log(message);
            }
            catch (error) {
                Logger_Lib_1.default.log(String(error));
                throw new Error_Lib_1.BadRequest('Email service is down, pls contact admin.');
            }
        });
    }
}
exports.default = EmailService;
