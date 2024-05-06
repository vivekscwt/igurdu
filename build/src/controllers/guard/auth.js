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
exports.registerGuard = void 0;
const Response_Lib_1 = __importDefault(require("../../libs/Response.Lib"));
const DBAdapter_1 = __importDefault(require("../../adapters/DBAdapter"));
const User_entity_1 = require("../../db/entities/User.entity");
const Error_Lib_1 = require("../../libs/Error.Lib");
const bcrypt_1 = __importDefault(require("bcrypt"));
const License_entity_1 = require("../../db/entities/License.entity");
const ProfessionalDetail_entity_1 = require("../../db/entities/ProfessionalDetail.entity");
const Location_entity_1 = require("../../db/entities/Location.entity");
const Profile_entity_1 = require("../../db/entities/Profile.entity");
const config_1 = require("../../config");
const Email_Service_1 = __importDefault(require("../../services/Email.Service"));
const Auth_Service_1 = __importDefault(require("../../services/Auth.Service"));
const Logger_Lib_1 = __importDefault(require("../../libs/Logger.Lib"));
// register as guard
const registerGuard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { professionalDetails, location, 
        // license
        siaNumber, expiryDateFrom, expiryDateTo, licenseSector, role, lookingFor, 
        // new trader
        first_name, last_name, phone, email, password, description, } = req.body;
        const db = new DBAdapter_1.default();
        const userExist = yield db.findOne(User_entity_1.User, { where: { email } });
        if (userExist)
            throw new Error_Lib_1.BadRequest('User with email already exits.');
        const siaExists = yield db.findOne(License_entity_1.License, { where: { sia_number: siaNumber } });
        if (siaExists)
            throw new Error_Lib_1.BadRequest('This license already exits.');
        // create user
        const hashedPass = bcrypt_1.default.hashSync(password, 10);
        const user = yield db.insertAndFetch(User_entity_1.User, {
            first_name,
            last_name,
            email,
            phone,
            password: hashedPass,
            role: config_1.USER_ROLES.GUARD,
            description
        });
        // add license
        const license = yield db.insertAndFetch(License_entity_1.License, {
            guard_id: user.id,
            sia_number: siaNumber,
            expiry_date_from: expiryDateFrom,
            expiry_date_to: expiryDateTo,
            sector: licenseSector,
            role,
            trades: lookingFor,
            status: config_1.STATUSES.UNVERIFIED
        });
        // add professional details
        const profession_detail = yield db.insertAndFetch(ProfessionalDetail_entity_1.ProfessionDetail, {
            operation_type: professionalDetails.operation_type,
            trading_name: professionalDetails.trading_name,
            registered_company_name: professionalDetails.registered_company_name,
            company_reg_no: professionalDetails.company_reg_no,
            fullNames_of_partners: professionalDetails.fullNames_of_partners
        });
        // location
        const location_profile = yield db.insertAndFetch(Location_entity_1.Location, {
            address: location.address,
            lat: location.lat,
            lng: location.lng,
            max_distance: location.max_distance,
        });
        yield db.insertAndFetch(Profile_entity_1.Profile, {
            user_id: user.id,
            location_id: location_profile.id,
            profession_details_id: profession_detail.id
        });
        // TODO: send verification email here.
        const auth = new Auth_Service_1.default();
        const token = yield auth.generateUserToken(user, '3d');
        const link = process.env.NODE_ENV == 'local' ? process.env.LOCAL_CLIENT : process.env.PROD_CLIENT;
        const verifyLink = `${link}/verify?token=${token}`;
        yield new Email_Service_1.default(user).send({
            subject: 'Verify user',
            html: `Hello ${user.first_name}, <br/>Click on the following link to verify your account: <a href="${verifyLink}">${verifyLink}</a> <br> Link will expire in 3 days`,
        }).catch(Logger_Lib_1.default.error);
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: 'Successfully registered, pls check your email to continue.',
            data: null
        });
    }
    catch (error) {
        next(error);
    }
});
exports.registerGuard = registerGuard;
