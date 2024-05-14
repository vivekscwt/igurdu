import 'dotenv/config';
import { DataSource } from 'typeorm';
import fs from "fs";
import path from "path";

export const ClientDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port:  parseInt(process.env.DATABASE_PORT) ?? 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  logging: process.env.NODE_ENV === 'local' ? "all" : ["query"],
  entities: [__dirname + '/entities/*{.ts,.js}'],
  subscribers: [],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  maxQueryExecutionTime: 2_000,
  // ssl: {
  //   ca: fs.readFileSync(path.join(__dirname,'ca-certificate.crt'))
  // }
  // legacySpatialSupport: false
  ssl : false
});