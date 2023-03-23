import { BuildSchemaOptions } from 'type-graphql';

import { BooksResolvers } from './book';
import { LocationResolvers } from './location';
import { PersonResolvers, PersonEventsResolvers } from './person';
import { VersionResolvers } from './version';

export const resolvers: BuildSchemaOptions = {
  resolvers: [
    BooksResolvers,
    LocationResolvers,
    PersonResolvers,
    PersonEventsResolvers,
    VersionResolvers,
  ],
};
