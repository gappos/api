import { BuildSchemaOptions } from 'type-graphql';

import { BooksResolvers } from './book';
import { LocationResolvers } from './location';
import { PersonResolvers, PersonEventsResolvers } from './person';

export const resolvers: BuildSchemaOptions = {
  resolvers: [BooksResolvers, LocationResolvers, PersonResolvers, PersonEventsResolvers],
};
