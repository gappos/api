import 'reflect-metadata';
import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSchema } from 'type-graphql';

import './db/sequelize';
import context from './middlewares/context';
import { resolvers } from './graphql/resolvers';

const app = express();
const httpServer = http.createServer(app);

const schema = await buildSchema(resolvers);
const server = new ApolloServer({ schema });
await server.start();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/graphql', expressMiddleware(server, { context }));

const port = parseInt(process.env.PORT as string) || 3000;
httpServer.listen({ port }, () => {
  console.log(`|===========================================|`);
  console.log(`| Genealogy tree API is ready at port: ${port} |`);
  console.log(`|===========================================|`);
});
