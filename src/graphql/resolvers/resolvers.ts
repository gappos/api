import { BuildSchemaOptions } from 'type-graphql';
import { BooksResolvers } from './book';
import { HelloResolvers } from './hello';
import { LocationResolvers } from './location';
import { PersonResolvers, PersonEventsResolvers } from './person';

export const resolvers: BuildSchemaOptions = {
  resolvers: [
    BooksResolvers,
    HelloResolvers,
    LocationResolvers,
    PersonResolvers,
    PersonEventsResolvers,
  ],
};
