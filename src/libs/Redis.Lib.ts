import { createClient, RedisClientType } from 'redis';
import LoggerLib from './Logger.Lib';
let client: RedisClientType

export default class RedisLib {
  static async getInstance(): Promise<RedisClientType> {
    if (client?.isOpen) {
      return client
    }
    client = client || createClient({ url: process.env.REDIS_URL });
    client.on('error', err => LoggerLib.error('Redis Client Error', err));
    client.on('ready', _ => LoggerLib.log('Redis Client Ready'));
    await client.connect();
    return client;
  }
}

RedisLib.getInstance()