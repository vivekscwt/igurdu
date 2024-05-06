import http from 'http';
import { ClientDataSource } from './db/datasource.config';
import server from './server';

export default async function bootstrap(): Promise<http.Server> {
  process.env.TZ = 'UTC'; // check/set timezone as per business/tech requirement.
  process.env.PORT = process.env.PORT || '80';
  process.env.APP_NAME = process.env.APP_NAME || 'APP';
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  await ClientDataSource.initialize();
  return server;
}