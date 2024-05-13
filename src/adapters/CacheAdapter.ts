import { RedisClientType } from "redis";
import LoggerLib from "../libs/Logger.Lib";
import RedisLib from "../libs/Redis.Lib";

export default class CacheAdapter {
  private cacheInstance: RedisClientType | null = null;

  constructor() { }

  async getInstance() {
    LoggerLib.log('getInstance')
    if (!this.cacheInstance) this.cacheInstance = await RedisLib.getInstance()
    return this.cacheInstance
  }

  async set(key: string, value: any, ttl?: number) {
    LoggerLib.log('set', value, ttl)
    const instance = await this.getInstance();
    const set = await instance[typeof value === 'object' ? 'HSET' : 'set'](key, value);
    if (ttl) await instance.expire(key, ttl)
    return set
  }

  async get<T>(key: string, field?: '*' | string): Promise<T> {
    LoggerLib.log('get')
    const instance = await this.getInstance();
    let value
    if (field === '*') value = await instance.HGETALL(key)
    else if (Array.isArray(field)) value = await instance.HMGET(key, field)
    else if (field) value = await instance.HGET(key, field)
    else value = await instance.get(key)
    return value as unknown as T;
  }

  async delete(key: string) {
    const instance = await this.getInstance();
    return instance.del(key)
  }
}