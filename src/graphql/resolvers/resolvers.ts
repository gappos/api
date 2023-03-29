import { BuildSchemaOptions } from 'type-graphql';

import { BooksResolvers } from './book';
import { ChildResolvers } from './child';
import { LocationResolvers } from './location';
import { PersonResolvers, PersonEventsResolvers } from './person';
import { RawResolvers } from './raw';
import { VersionResolvers } from './version';

export const resolvers: BuildSchemaOptions = {
  resolvers: [
    BooksResolvers,
    ChildResolvers,
    LocationResolvers,
    PersonResolvers,
    PersonEventsResolvers,
    RawResolvers,
    VersionResolvers,
  ],
};
