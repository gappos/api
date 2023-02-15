import { ApolloServer } from '@apollo/server';
import express from 'express';
import { buildSchema } from 'type-graphql';
import bodyParser from 'body-parser';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';

import { resolvers } from './graphql/resolvers';
import context from './middlewares/context';
import './db/sequelize';

const createApp = async () => {
  const app = express();

  const schema = await buildSchema({
    ...resolvers,
    validate: false,
  });
  const server = new ApolloServer({ schema });
  await server.start();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  app.use('/graphql', expressMiddleware(server, { context }));

  return app;
};

export default createApp;
