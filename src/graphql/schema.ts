import { buildSchema } from 'type-graphql';

import { resolvers } from './resolvers';

export const schema = buildSchema({
  ...resolvers,
  validate: false,
});
