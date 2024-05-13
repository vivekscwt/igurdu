import { AssertionError } from 'assert';
import { CelebrateError } from 'celebrate';
import express from 'express';
import cors from 'cors';

import ErrorLib from './libs/Error.Lib';
import LoggerLib from './libs/Logger.Lib';
import ResponseLib from './libs/Response.Lib';
import http from 'http';
import httpContext from 'express-http-context'
import { v4 as uuidv4 } from 'uuid';
import DBAdapter from './adapters/DBAdapter';
import routes from './routes';

const app = express();
const server = http.createServer(app);

app.set('trust proxy', true);

app.use(cors({ exposedHeaders: ['access-token'] }));
app.use(express.json());

app.use(httpContext.middleware)

app.use((req, res, next) => {
  httpContext.set('request-id', uuidv4().toString());
  LoggerLib.log('API Request:', {
    url: req.url, method: req.method, request: req.body
  });
  next()
})
app.get('/', (req, res) => new ResponseLib(req, res).status(200).json({ message: 'OK!' }));
app.get('/health', async (req, res, next) => {
  try {
    const data = await new DBAdapter().raw('SELECT NOW() AS now');
    new ResponseLib(req, res).status(200).json({ message: 'OK!', timestamp: data[0].now })
  } catch (error) {
    next(error)
  }
});

app.use('/api/v1', routes);

app.use((req: express.Request, res: express.Response) => {
  new ResponseLib(req, res).status(404).json({ message: 'Not Found' });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  LoggerLib.error(err);
  let message = 'Server Error', statusCode = 500;
  if (err instanceof ErrorLib) {
    message = err.message;
    statusCode = err.code;
  } else if (err instanceof CelebrateError) {
    message = err.details.entries().next().value[1].details[0].message.replace(/["]+/g, '').replace(/_/g, ' ')
    statusCode = 400;
  } else if (err instanceof AssertionError) {
    message = err.message;
    statusCode = 400;
  }
  new ResponseLib(req, res).status(statusCode).json({ success: false, message });
});


export = server;