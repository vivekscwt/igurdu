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
const User_entity_1 = require("../db/entities/User.entity");
const Error_Lib_1 = require("../libs/Error.Lib");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const DBAdapter_1 = __importDefault(require("../adapters/DBAdapter"));
class AuthService {
    constructor() { }
    ;
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield new DBAdapter_1.default().findOne(User_entity_1.User, {
                where: { id, meta: { deleted_flag: false } }
            });
            if (!user)
                throw new Error_Lib_1.NotFound('User does not exist.');
            return user;
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield new DBAdapter_1.default().findOne(User_entity_1.User, {
                where: { email, meta: { deleted_flag: false } }
            });
            if (!user)
                throw new Error_Lib_1.NotFound('User does not exist.');
            return user;
        });
    }
    validateUserPassword(password, passwordCrypt) {
        return __awaiter(this, void 0, void 0, function* () {
            const matches = bcrypt_1.default.compareSync(password, passwordCrypt);
            if (!matches)
                throw new Error_Lib_1.BadRequest('Incorrect password.');
            return matches;
        });
    }
    generateUserToken(user_1) {
        return __awaiter(this, arguments, void 0, function* (user, expiry = '1d', scope) {
            const token = jsonwebtoken_1.default.sign({ i: user.id, type: user.role, scope }, process.env.JWT_TOKEN, { expiresIn: expiry });
            //console.log('token value:', token);
            return token;
        });
    }
    generateAuthToken() {
        return __awaiter(this, arguments, void 0, function* (length = 6) {
            const allowedChars = '0123456789';
            let otp = '';
            for (let i = 0; i < length; i++) {
                const random = Math.floor(Math.random() * allowedChars.length);
                otp += allowedChars[random];
            }
            return otp;
        });
    }
    canRegisterUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.findUserByEmail(email);
                if (user)
                    throw new Error_Lib_1.BadRequest('User with this email exists');
            }
            catch (error) {
                if (!(error instanceof Error_Lib_1.NotFound)) {
                    throw error;
                }
            }
            return true;
        });
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt_1.default.hashSync(password, 10);
        });
    }
    registerUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const password = data.password;
            return yield new DBAdapter_1.default().insertAndFetch(User_entity_1.User, Object.assign(Object.assign({}, data), { password: this.hashPassword(password) }));
        });
    }
}
exports.default = AuthService;
