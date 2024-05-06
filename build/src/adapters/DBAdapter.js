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
const typeorm_1 = require("typeorm");
const Logger_Lib_1 = __importDefault(require("../libs/Logger.Lib"));
const TypeORM_Lib_1 = __importDefault(require("../libs/TypeORM.Lib"));
class DBAdapter {
    constructor(dbName) {
        this.dbName = dbName;
        this.dbInstance = null;
        this.runner = null;
    }
    transaction() {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_Lib_1.default.log('transaction');
            this.runner = (yield TypeORM_Lib_1.default.getInstance(this.dbName)).createQueryRunner();
            yield this.runner.connect();
            yield this.runner.startTransaction();
            this.dbInstance = this.runner.manager;
        });
    }
    commit() {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_Lib_1.default.log('commit');
            if (!this.runner)
                throw new Error('Cannot commit without starting a transaction');
            yield this.runner.commitTransaction();
            yield this.runner.release();
            this.dbInstance = null;
        });
    }
    rollback() {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_Lib_1.default.log('rollback');
            if (!this.runner)
                throw new Error('Cannot rollback without starting a transaction');
            yield this.runner.rollbackTransaction();
            yield this.runner.release();
            this.dbInstance = null;
        });
    }
    getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_Lib_1.default.log('getInstance');
            if (!this.dbInstance)
                this.dbInstance = yield TypeORM_Lib_1.default.getInstance(this.dbName);
            return this.dbInstance;
        });
    }
    getBuilder(table) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_Lib_1.default.log('getBuilder', { table });
            const instance = yield this.getInstance();
            return instance.getRepository(table).createQueryBuilder();
        });
    }
    raw(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, parameters = {}) {
            Logger_Lib_1.default.log('raw', { query, parameters });
            this.runner = (yield TypeORM_Lib_1.default.getInstance(this.dbName)).createQueryRunner();
            try {
                yield this.runner.connect();
                const [escapedQuery, escapedParams] = this.runner.connection.driver.escapeQueryWithParameters(query, parameters, {});
                const result = yield this.runner.manager.query(escapedQuery, escapedParams);
                return result;
            }
            finally {
                yield this.runner.release();
            }
        });
    }
    find(table, options) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_Lib_1.default.log('find', { table, options });
            const instance = yield this.getInstance();
            const builder = instance.getRepository(table).createQueryBuilder().setFindOptions(options);
            if (options.groupBy)
                builder.groupBy(options.groupBy);
            return builder.getMany();
        });
    }
    findAndCount(table, options) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_Lib_1.default.log('findAndCount', { table, options });
            const instance = yield this.getInstance();
            return instance.getRepository(table).findAndCount(options);
        });
    }
    findOne(table, options) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_Lib_1.default.log('findOne', { table, options });
            const instance = yield this.getInstance();
            return instance.getRepository(table).findOne(options);
        });
    }
    update(table, criteria, data) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_Lib_1.default.log('update', { table, criteria, data });
            const instance = yield this.getInstance();
            return instance.getRepository(table).update(criteria, data);
        });
    }
    updateAndFetch(table, criteria, data, parameters, relations) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_Lib_1.default.log('updateAndFetch', { table, criteria, data, parameters });
            const instance = yield this.getInstance();
            const builder = instance.getRepository(table).createQueryBuilder().update().set(data).where(criteria);
            if (parameters)
                builder.setParameters(parameters);
            yield builder.execute();
            return instance.getRepository(table).findOne({ where: criteria, relations });
        });
    }
    insert(table, data) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_Lib_1.default.log('insert', { table, data });
            const instance = yield this.getInstance();
            return instance.getRepository(table).insert(data);
        });
    }
    insertAndFetch(table, data, relations) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_Lib_1.default.log('insertAndFetch', { table, data });
            const instance = yield this.getInstance();
            const result = yield instance.getRepository(table).insert(data);
            if (Array.isArray(data)) {
                // @ts-ignore
                return instance.getRepository(table).find({ where: { id: (0, typeorm_1.In)(result.generatedMaps.map(({ id }) => id)) }, relations });
            }
            return instance.getRepository(table).findOne({ where: { id: result.raw[0].id }, relations });
        });
    }
}
exports.default = DBAdapter;
