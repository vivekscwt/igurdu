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
exports.updateProfile = exports.getProfile = void 0;
const DBAdapter_1 = __importDefault(require("../../adapters/DBAdapter"));
const Response_Lib_1 = __importDefault(require("../../libs/Response.Lib"));
const Error_Lib_1 = require("../../libs/Error.Lib");
const Profile_entity_1 = require("../../db/entities/Profile.entity");
const ProfessionalDetail_entity_1 = require("../../db/entities/ProfessionalDetail.entity");
const Location_entity_1 = require("../../db/entities/Location.entity");
const Document_entity_1 = require("../../db/entities/Document.entity");
const Profile_Mapper_1 = __importDefault(require("../../mappers/Profile.Mapper"));
// get profile
const getProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const db = new DBAdapter_1.default();
        const profile = yield db.findOne(Profile_entity_1.Profile, {
            where: {
                user_id: user.id,
            },
            relations: {
                user: true,
                location: true,
                profession_details: true
            }
        });
        if (!profile)
            throw new Error_Lib_1.BadRequest('Please update your profile.');
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: "Profile fetched successfully.",
            data: Profile_Mapper_1.default.toDTO(profile)
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getProfile = getProfile;
// update profile
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const db = new DBAdapter_1.default();
        const { professionalDetails, location, documents, maxDistance, } = req.body;
        let updated_profile;
        let profile = yield db.findOne(Profile_entity_1.Profile, {
            where: {
                user_id: user.id,
            },
            relations: {
                user: true,
                location: true,
                profession_details: true
            }
        });
        if (!profile) {
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
                max_distance: maxDistance,
            });
            yield db.insert(Profile_entity_1.Profile, {
                user_id: user.id,
                location_id: location_profile.id,
                profession_details_id: profession_detail.id
            });
        }
        else {
            if (professionalDetails) {
                yield db.update(ProfessionalDetail_entity_1.ProfessionDetail, { id: profile === null || profile === void 0 ? void 0 : profile.profession_details_id }, {
                    operation_type: professionalDetails.operation_type,
                    trading_name: professionalDetails.trading_name,
                    registered_company_name: professionalDetails.registered_company_name,
                    company_reg_no: professionalDetails.company_reg_no,
                    fullNames_of_partners: professionalDetails.fullNames_of_partners
                });
            }
            if (location) {
                updated_profile = yield db.update(Location_entity_1.Location, { id: profile === null || profile === void 0 ? void 0 : profile.location_id }, {
                    address: location.address,
                    lat: location.lat,
                    lng: location.lng,
                    max_distance: location.max_distance,
                });
            }
        }
        if (documents) {
            const data = documents === null || documents === void 0 ? void 0 : documents.map((d) => {
                return {
                    user_id: user.id,
                    doc_type: documents.doc_type,
                    direction: documents.direction,
                    url: documents.url,
                };
            });
            yield db.insert(Document_entity_1.Documents, data);
        }
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: "Profile updated successfully.",
            data: Profile_Mapper_1.default.toDTO(profile || updated_profile)
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateProfile = updateProfile;
