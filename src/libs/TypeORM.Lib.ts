import { DataSource } from "typeorm";
import { ClientDataSource } from "../db/datasource.config";
import LoggerLib from "./Logger.Lib";

export default class TypeORMLib {
  static async getInstance(dbName: string = process.env.DATABASE_NAME as string): Promise<DataSource> {
    const datasource = ClientDataSource;
    if (datasource.isInitialized) {
      return datasource
    }
    await datasource.initialize()
    LoggerLib.log('DB Client Ready')
    return datasource;
  }
}

TypeORMLib.getInstance()