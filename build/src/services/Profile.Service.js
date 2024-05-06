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
const bcrypt_1 = __importDefault(require("bcrypt"));
const Auth_Service_1 = __importDefault(require("./Auth.Service"));
const DBAdapter_1 = __importDefault(require("../adapters/DBAdapter"));
const MediaFile_entity_1 = require("../db/entities/MediaFile.entity");
const config_1 = require("../config");
// import aws from 'aws-sdk';
// const s3 = new aws.S3({
//   accessKeyId: process.env.AWS_KEY,
//   secretAccessKey: process.env.AWS_SECRET,
//   signatureVersion: 'v4',
//   region: 'us-east-2'
// });
class ProfileService extends Auth_Service_1.default {
    constructor(user) {
        super();
        this.user = user;
    }
    updateProfile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.profile_picture_id) {
                const media = yield new DBAdapter_1.default().find(MediaFile_entity_1.MediaFile, {
                    where: { id: data.profile_picture_id, user_id: this.user.id, meta: { deleted_flag: false } }
                });
                if (!media)
                    throw new Error_Lib_1.NotFound('Media file does not exist.');
            }
            const user = yield new DBAdapter_1.default().updateAndFetch(User_entity_1.User, { id: this.user.id, meta: { deleted_flag: false } }, {
                first_name: data.first_name,
                last_name: data.last_name,
                profile_picture_id: data.profile_picture_id
            });
            return user;
        });
    }
    updatePassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordCrypt = bcrypt_1.default.hashSync(password, 10);
            yield new DBAdapter_1.default().update(User_entity_1.User, { id: this.user.id, meta: { deleted_flag: false } }, { password: passwordCrypt });
        });
    }
    activateAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new DBAdapter_1.default().update(User_entity_1.User, { id: this.user.id, meta: { deleted_flag: false } }, { status: config_1.STATUSES.ACTIVE });
        });
    }
}
exports.default = ProfileService;
