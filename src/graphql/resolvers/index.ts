import { BuildSchemaOptions } from 'type-graphql';
import { BooksResolvers } from './book';
import { HelloResolvers } from './hello';

export const resolvers: BuildSchemaOptions = {
  resolvers: [BooksResolvers, HelloResolvers]
};
