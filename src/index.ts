import 'reflect-metadata';
import http from 'http';

import createApp from './app';

(async () => {
  const app = await createApp();

  const httpServer = http.createServer(app);
  const port = parseInt(process.env.PORT as string) || 3000;
  httpServer.listen({ port }, () => {
    console.log(`|===========================================|`);
    console.log(`| Genealogy tree API is ready at port: ${port} |`);
    console.log(`|===========================================|`);
  });
})();
