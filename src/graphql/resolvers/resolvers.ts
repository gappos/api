import { BuildSchemaOptions } from 'type-graphql';

import { ChildResolvers } from './child';
import { LocationResolvers } from './location';
import { PersonResolvers, PersonEventsResolvers } from './person';
import { RawResolvers } from './raw';
import { SpouseResolvers } from './spouse';
import { VersionResolvers } from './version';

export const resolvers: BuildSchemaOptions = {
  resolvers: [
    ChildResolvers,
    LocationResolvers,
    PersonResolvers,
    PersonEventsResolvers,
    RawResolvers,
    SpouseResolvers,
    VersionResolvers,
  ],
};
