"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.verifyUser = exports.changePassword = exports.resetPassword = exports.getResetPasswordLink = exports.resendLink = exports.register = exports.login = void 0;
const Error_Lib_1 = __importStar(require("../libs/Error.Lib"));
const Response_Lib_1 = __importDefault(require("../libs/Response.Lib"));
const User_Mapper_1 = __importDefault(require("../mappers/User.Mapper"));
const Auth_Service_1 = __importDefault(require("../services/Auth.Service"));
const config_1 = require("../config");
const Email_Service_1 = __importDefault(require("../services/Email.Service"));
const Logger_Lib_1 = __importDefault(require("../libs/Logger.Lib"));
const DBAdapter_1 = __importDefault(require("../adapters/DBAdapter"));
const User_entity_1 = require("../db/entities/User.entity");
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const auth = new Auth_Service_1.default();
        const user = yield auth.findUserByEmail(body.email);
        yield auth.validateUserPassword(body.password, user.password);
        if (user.status !== config_1.STATUSES.ACTIVE) {
            throw new Error_Lib_1.default(`Cannot login, account is ${user.status}.`, 400);
        }
        const token = yield auth.generateUserToken(user, '1d', 'verify');
        const data = {
            subject: "Login successful.",
            html: `Hello ${user.first_name}, <br /> You have just logged into your Igarudu account.`
        };
        yield new Email_Service_1.default(user).send(data);
        // .catch(LoggerLib.error);
        return new Response_Lib_1.default(req, res)
            .setHeader({ 'access-token': token }).json(Object.assign(Object.assign({ success: true, message: 'Successfully logged in' }, User_Mapper_1.default.toDTO(user)), { token }));
    }
    catch (error) {
        if (error instanceof Error_Lib_1.NotFound || error instanceof Error_Lib_1.BadRequest) {
            return next(new Error_Lib_1.BadRequest('Incorrect username or password'));
        }
        next(error);
    }
});
exports.login = login;
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { first_name, last_name, email, phone, password, role, } = req.body;
        const auth = new Auth_Service_1.default();
        email && (yield auth.canRegisterUserByEmail(email));
        const user = yield auth.registerUser({ first_name, last_name, email, phone, password, role });
        const token = yield auth.generateUserToken(user, '3d');
        new Email_Service_1.default(user).send('{ token }').catch(Logger_Lib_1.default.error);
        return new Response_Lib_1.default(req, res).status(201).json({
            status: true,
            message: 'A verification link has been sent to your email.',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.register = register;
// resend link,
const resendLink = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const auth = new Auth_Service_1.default();
        const token = yield auth.generateUserToken(user, '3d');
        new Email_Service_1.default(user).send('{ token }').catch(Logger_Lib_1.default.error);
        return new Response_Lib_1.default(req, res).status(201).json({
            status: true,
            message: 'A verification link has been resent to your email.',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.resendLink = resendLink;
const getResetPasswordLink = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const auth = new Auth_Service_1.default();
        const user = yield auth.findUserByEmail(email).catch(Logger_Lib_1.default.error);
        if (user) {
            const token = yield auth.generateUserToken(user, '3d');
            new Email_Service_1.default(user).send('{ token }').catch(Logger_Lib_1.default.error);
        }
        return new Response_Lib_1.default(req, res).status(201).json({
            status: true,
            message: 'A verification link has been resent to your email.',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getResetPasswordLink = getResetPasswordLink;
// reset password
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const auth = new Auth_Service_1.default();
        const { password } = req.body;
        const hashPassword = yield auth.hashPassword(password);
        const updated = yield new DBAdapter_1.default().updateAndFetch(User_entity_1.User, { email: user.email }, {
            password: hashPassword
        });
        const token = yield auth.generateUserToken(user, '3d');
        return new Response_Lib_1.default(req, res).json({
            status: true,
            message: 'Password updated successfully.',
            data: {
                token,
                user: User_Mapper_1.default.toDTO(updated)
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.resetPassword = resetPassword;
//
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const auth = new Auth_Service_1.default();
        const { oldPassword, password } = req.body;
        const foundUser = yield auth.findUserByEmail(user.email);
        const oldHash = yield auth.hashPassword(oldPassword);
        yield auth.validateUserPassword(oldHash, foundUser.password);
        const hashPassword = yield auth.hashPassword(password);
        const updated = yield new DBAdapter_1.default().updateAndFetch(User_entity_1.User, { email: user.email }, {
            password: hashPassword
        });
        return new Response_Lib_1.default(req, res).json({
            status: true,
            message: 'Password updated successfully.',
            data: User_Mapper_1.default.toDTO(updated)
        });
    }
    catch (error) {
        next(error);
    }
});
exports.changePassword = changePassword;
const verifyUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const db = new DBAdapter_1.default();
        yield db.updateAndFetch(User_entity_1.User, { id: user.id }, { status: config_1.STATUSES.ACTIVE });
        return new Response_Lib_1.default(req, res).json({
            success: true
        });
    }
    catch (error) {
        next(error);
    }
});
exports.verifyUser = verifyUser;
