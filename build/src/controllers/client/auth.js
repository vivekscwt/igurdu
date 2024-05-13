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
exports.registerClient = void 0;
const Response_Lib_1 = __importDefault(require("../../libs/Response.Lib"));
const DBAdapter_1 = __importDefault(require("../../adapters/DBAdapter"));
const User_entity_1 = require("../../db/entities/User.entity");
const Error_Lib_1 = require("../../libs/Error.Lib");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../../config");
const Job_entity_1 = require("../../db/entities/Job.entity");
const Auth_Service_1 = __importDefault(require("../../services/Auth.Service"));
const Email_Service_1 = __importDefault(require("../../services/Email.Service"));
// post job / create account
const registerClient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobTitle, jobDescription, location, lookingFor, quantity, startDateTime, maxBudget, 
        // new client
        first_name, last_name, phone, email, password, } = req.body;
        let user = req.user;
        const db = new DBAdapter_1.default();
        if (!user) {
            const userExist = yield db.findOne(User_entity_1.User, { where: { email, meta: { deleted_flag: false } } });
            if (userExist)
                throw new Error_Lib_1.BadRequest('User with email already exits.');
            user = yield db.insertAndFetch(User_entity_1.User, {
                first_name,
                last_name,
                email,
                phone,
                password: bcrypt_1.default.hashSync(password, 10),
                role: config_1.USER_ROLES.CLIENT,
                status: config_1.STATUSES.NOT_VERIFIED
            });
        }
        const job = yield db.insertAndFetch(Job_entity_1.Job, {
            client_id: user.id,
            title: jobTitle,
            description: jobDescription,
            address: location.address,
            lat: location.lat,
            lng: location.lng,
            postcode: '-',
            quantity,
            lookingFor: lookingFor,
            startDateTime,
            budget: maxBudget,
            status: config_1.STATUSES.OPEN
        });
        const message = user ? "Job posted successfully." : 'Successfully created your account, pls check your email to continue.';
        // TODO: send verification email here.
        console.log('\n');
        console.log('=??>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        console.log('=====>', user);
        console.log('\n');
        const auth = new Auth_Service_1.default();
        const token = yield auth.generateUserToken(user, '3d');
        const link = process.env.NODE_ENV == 'local' ? process.env.LOCAL_CLIENT : process.env.PROD_CLIENT;
        const verifyLink = `${link}/verify?token=${token}`;
        yield new Email_Service_1.default(user).send({
            subject: 'Verify user',
            html: `Hello ${user.first_name}, <br/>Click on the following link to verify your account: <a href="${verifyLink}">${verifyLink}</a> <br> Link will expire in 3 days`,
        });
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message,
            data: user ? job : null
        });
    }
    catch (error) {
        next(error);
    }
});
exports.registerClient = registerClient;
