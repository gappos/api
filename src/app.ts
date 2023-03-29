import { ApolloServer } from '@apollo/server';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';

import context from './middlewares/context';
import { schema } from './graphql';

const createApp = async () => {
  const app = express();
  const server = new ApolloServer({ schema: await schema });
  await server.start();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  app.use('/graphql', expressMiddleware(server, { context }));

  return app;
};

export default createApp;
console.debug('DEBUG: in app file');
