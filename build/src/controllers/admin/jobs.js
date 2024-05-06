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
exports.updateJobStatus = exports.getAllJobs = void 0;
const DBAdapter_1 = __importDefault(require("../../adapters/DBAdapter"));
const Response_Lib_1 = __importDefault(require("../../libs/Response.Lib"));
const Job_entity_1 = require("../../db/entities/Job.entity");
const Utils_Service_1 = __importDefault(require("../../services/Utils.Service"));
const getAllJobs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { budget, created_at, page, limit } = req.query;
        const db = new DBAdapter_1.default();
        const skip = (Number(page) - 1) * Number(limit);
        const [jobs, total] = yield db.findAndCount(Job_entity_1.Job, {
            where: { meta: { deleted_flag: false } },
            relations: {
                user: true
            },
            skip,
            take: limit,
            order: {
                budget: budget === 'high' ? 'DESC' : 'ASC',
                meta: { created_on: created_at === 'high' ? 'DESC' : 'ASC' }
            }
        });
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: 'Jobs fetched!',
            data: jobs,
            meta: Utils_Service_1.default.paginate(req.query, { items: jobs, total })
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllJobs = getAllJobs;
const updateJobStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const db = new DBAdapter_1.default();
        const job = yield db.updateAndFetch(Job_entity_1.Job, { id: Number(id) }, {
            status
        });
        return new Response_Lib_1.default(req, res).json({
            success: true,
            message: 'Job status updated.',
            data: job
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateJobStatus = updateJobStatus;
