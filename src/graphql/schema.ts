import { buildSchema } from 'type-graphql';

import { resolvers } from './resolvers';
import '../db/sequelize';

export const schema = buildSchema({
  ...resolvers,
  validate: false,
});
