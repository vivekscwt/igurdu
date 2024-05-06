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
exports.deleteUser = exports.updateAccountStatus = exports.me = void 0;
const Response_Lib_1 = __importDefault(require("../libs/Response.Lib"));
const DBAdapter_1 = __importDefault(require("../adapters/DBAdapter"));
const User_entity_1 = require("../db/entities/User.entity");
const Error_Lib_1 = require("../libs/Error.Lib");
const User_Mapper_1 = __importDefault(require("../mappers/User.Mapper"));
const me = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const profile = yield new DBAdapter_1.default().findOne(User_entity_1.User, {
            where: {
                id: user.id,
                meta: { deleted_flag: false }
            }
        });
        if (!profile)
            throw new Error_Lib_1.BadRequest('User not found.');
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: "Profile fetched successfully.",
            data: User_Mapper_1.default.toDTO(profile)
        });
    }
    catch (error) {
        next(error);
    }
});
exports.me = me;
const updateAccountStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const db = new DBAdapter_1.default();
        const user = yield db.updateAndFetch(User_entity_1.User, {
            id: Number(id),
            meta: { deleted_flag: false }
        }, { status });
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: 'User status updated.',
            data: user
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateAccountStatus = updateAccountStatus;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const db = new DBAdapter_1.default();
        yield db.update(User_entity_1.User, {
            id: Number(id),
            meta: { deleted_flag: false }
        }, { meta: { deleted_flag: true } });
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: 'User deleted',
            data: null
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUser = deleteUser;
