import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { resolvers, typeDefs } from './graphql';

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const { url } = await startStandaloneServer(server, {
  listen: { port: +process.env.PORT || 3000 }
});

console.log(`Genealogy tree API ready at: ${url}`);
