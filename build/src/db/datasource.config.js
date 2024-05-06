"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientDataSource = void 0;
require("dotenv/config");
const typeorm_1 = require("typeorm");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.ClientDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: (_a = parseInt(process.env.DATABASE_PORT)) !== null && _a !== void 0 ? _a : 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: false,
    logging: process.env.NODE_ENV === 'local' ? "all" : ["query"],
    entities: [__dirname + '/entities/*{.ts,.js}'],
    subscribers: [],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    maxQueryExecutionTime: 2000,
    ssl: {
        ca: fs_1.default.readFileSync(path_1.default.join(__dirname, 'ca-certificate.crt'))
    }
    // legacySpatialSupport: false
});
