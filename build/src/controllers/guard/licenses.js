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
exports.updateLicense = exports.getLicense = exports.createLicense = void 0;
const DBAdapter_1 = __importDefault(require("../../adapters/DBAdapter"));
const Response_Lib_1 = __importDefault(require("../../libs/Response.Lib"));
const License_entity_1 = require("../../db/entities/License.entity");
const Error_Lib_1 = require("../../libs/Error.Lib");
const config_1 = require("../../config");
const License_Mapper_1 = __importDefault(require("../../mappers/License.Mapper"));
// add license
const createLicense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { siaNumber, expiryDateFrom, expiryDateTo, licenseSector, role, trades, } = req.body;
        const db = new DBAdapter_1.default();
        const siaExists = yield db.findOne(License_entity_1.License, { where: { sia_number: siaNumber } });
        if (siaExists)
            throw new Error_Lib_1.BadRequest('This license already exits.');
        const license = yield db.insertAndFetch(License_entity_1.License, {
            guard_id: user.id,
            sia_number: siaNumber,
            expiry_date_from: expiryDateFrom,
            expiry_date_to: expiryDateTo,
            sector: licenseSector,
            role,
            trades,
            status: config_1.STATUSES.UNVERIFIED
        });
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: "License creates successfully.",
            data: License_Mapper_1.default.toDTO(license)
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createLicense = createLicense;
// get license
const getLicense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const db = new DBAdapter_1.default();
        const license = yield db.find(License_entity_1.License, {
            where: {
                guard_id: user.id,
                meta: { deleted_flag: false }
            },
            order: { id: 'DESC' }
        });
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: "License fetched successfully.",
            data: license.map((l) => License_Mapper_1.default.toDTO(l))
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getLicense = getLicense;
// add trades (update license)
const updateLicense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { id, trades, } = req.body;
        const db = new DBAdapter_1.default();
        const license = yield db.updateAndFetch(License_entity_1.License, { id, guard_id: user.id }, { trades });
        if (!license)
            throw new Error_Lib_1.BadRequest('Failed to update trades. Try again later.');
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: "License updated successfully.",
            data: license
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateLicense = updateLicense;
