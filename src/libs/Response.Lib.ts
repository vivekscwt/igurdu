import express from 'express';
import LoggerLib from '../libs/Logger.Lib';
import httpContext from 'express-http-context';

export default class ResponseLib {
  constructor(private _req: express.Request, private _res: express.Response) { }

  status(statuscode: number) {
    this._res.status(statuscode);
    return this;
  }

  json<T>(data: T) {
    this._res.statusCode = this._res.statusCode ?? 200;
    LoggerLib.log('API Response:', {
      url: this._req.url,
      method: this._req.method,
      status: this._res.statusCode,
      response: data
    });
    this._res.set('X-Request-ID', httpContext.get('request-id'))
    this._res.json(data);
    return this;
  }

  setHeader(data: Record<string, string>) {
    for (const key in data) {
      this._res.set(key, data[key])
    }
    return this
  }
}