import { DataSource, EntityManager, EntityTarget, FindManyOptions, FindOneOptions, FindOptionsWhere, In, InsertResult, ObjectLiteral, QueryRunner, UpdateResult } from "typeorm";
import { QueryDeepPartialEntity, } from "typeorm/query-builder/QueryPartialEntity";
import LoggerLib from "../libs/Logger.Lib";
import TypeORMLib from "../libs/TypeORM.Lib";

export default class DBAdapter {
  private dbInstance: DataSource | EntityManager | null = null;
  private runner: QueryRunner | null = null;

  constructor(public dbName?: string) { }

  async transaction() {
    LoggerLib.log('transaction')
    this.runner = (await TypeORMLib.getInstance(this.dbName)).createQueryRunner();
    await this.runner.connect();
    await this.runner.startTransaction();
    this.dbInstance = this.runner.manager
  }

  async commit() {
    LoggerLib.log('commit')
    if (!this.runner) throw new Error('Cannot commit without starting a transaction')
    await this.runner.commitTransaction();
    await this.runner.release();
    this.dbInstance = null;
  }

  async rollback() {
    LoggerLib.log('rollback')
    if (!this.runner) throw new Error('Cannot rollback without starting a transaction')
    await this.runner.rollbackTransaction();
    await this.runner.release();
    this.dbInstance = null;
  }

  async getInstance() {
    LoggerLib.log('getInstance')
    if (!this.dbInstance) this.dbInstance = await TypeORMLib.getInstance(this.dbName)
    return this.dbInstance
  }

  async getBuilder<T extends ObjectLiteral>(table: EntityTarget<T> | string) {
    LoggerLib.log('getBuilder', { table })
    const instance = await this.getInstance();
    return instance.getRepository(table).createQueryBuilder()
  }

  async raw<T extends ObjectLiteral>(query: string, parameters: ObjectLiteral = {}) {
    LoggerLib.log('raw', { query, parameters })
    this.runner = (await TypeORMLib.getInstance(this.dbName)).createQueryRunner();
    try {
      await this.runner.connect()
      const [escapedQuery, escapedParams] = this.runner.connection.driver.escapeQueryWithParameters(query, parameters, {});
      const result = await this.runner.manager.query(escapedQuery, escapedParams);
      return result as T[];
    } finally {
      await this.runner.release()
    }
  }

  async find<T extends ObjectLiteral>(table: EntityTarget<T> | string, options: FindManyOptions<T> & { groupBy?: Extract<keyof T, string> }): Promise<T[]> {
    LoggerLib.log('find', { table, options })
    const instance = await this.getInstance();
    const builder = instance.getRepository(table).createQueryBuilder().setFindOptions(options);
    if (options.groupBy) builder.groupBy(options.groupBy)
    return builder.getMany()
  }

  async findAndCount<T extends ObjectLiteral>(table: EntityTarget<T> | string, options: FindManyOptions<T> & { groupBy?: Extract<keyof T, string> }): Promise<[T[], number]> {
    LoggerLib.log('findAndCount', { table, options })
    const instance = await this.getInstance();
    return instance.getRepository(table).findAndCount(options)
  }


  async findOne<T extends ObjectLiteral>(table: EntityTarget<T> | string, options: FindOneOptions<T>): Promise<T | null> {
    LoggerLib.log('findOne', { table, options })
    const instance = await this.getInstance();
    return instance.getRepository(table).findOne(options)
  }

  async update<T extends ObjectLiteral>(table: EntityTarget<T> | string, criteria: FindOptionsWhere<T>, data: QueryDeepPartialEntity<T>): Promise<UpdateResult> {
    LoggerLib.log('update', { table, criteria, data })
    const instance = await this.getInstance();
    return instance.getRepository(table).update(criteria, data)
  }

  async updateAndFetch<T extends ObjectLiteral>(table: EntityTarget<T> | string, criteria: FindOptionsWhere<T>, data: QueryDeepPartialEntity<T>, parameters?: any, relations?: any): Promise<T> {
    LoggerLib.log('updateAndFetch', { table, criteria, data, parameters })
    const instance = await this.getInstance();
    const builder = instance.getRepository(table).createQueryBuilder().update().set(data).where(criteria);
    if (parameters) builder.setParameters(parameters);
    await builder.execute();
    return instance.getRepository(table).findOne({ where: criteria, relations }) as unknown as T
  }

  async insert<T extends ObjectLiteral>(table: EntityTarget<T> | string, data: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[]): Promise<InsertResult> {
    LoggerLib.log('insert', { table, data })
    const instance = await this.getInstance();
    return instance.getRepository(table).insert(data)
  }

  async insertAndFetch<T extends ObjectLiteral>(table: EntityTarget<T> | string, data: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[], relations?: any ): Promise<T> {
    LoggerLib.log('insertAndFetch', { table, data })
    const instance = await this.getInstance();
    const result = await instance.getRepository(table).insert(data)
    if (Array.isArray(data)) {
      // @ts-ignore
      return instance.getRepository(table).find({ where: { id: In(result.generatedMaps.map(({ id }) => id)) }, relations }) as unknown as T
    }
    return instance.getRepository(table).findOne({ where: { id: result.raw[0].id }, relations }) as unknown as T
  }
}