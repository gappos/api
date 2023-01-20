import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';

import resolvers from './graphql/resolvers';
const typeDefs = readFileSync('./src/graphql/schema.graphql', {
  encoding: 'utf-8'
});

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const { url } = await startStandaloneServer(server, {
  listen: { port: +process.env.PORT || 3000 }
});

console.log(`Genealogy tree API ready at: ${url}`);
