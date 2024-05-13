import 'dotenv/config';
import bootstrap from './bootstrap';
import server from './server';
import LoggerLib from './libs/Logger.Lib';

(async () => {
  await bootstrap();
  const listener = server.listen(process.env.PORT, function () {
    const address = listener.address();
    const binding = typeof address === 'string' ? `pipe/socket ${address}` : `port :${address?.port}`;
    LoggerLib.log(`${process.env.APP_NAME} Server running on ${binding}, env ${process.env.NODE_ENV}`);
  });
})();
