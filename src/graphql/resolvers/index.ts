import { BuildSchemaOptions } from 'type-graphql';
import { BooksResolver } from './book';
import { HelloResolver } from './hello';

export const resolvers: BuildSchemaOptions = {
  resolvers: [BooksResolver, HelloResolver]
};
