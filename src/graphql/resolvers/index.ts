import { BuildSchemaOptions, Field, ObjectType } from 'type-graphql';
import { BooksResolvers } from './book';
import { HelloResolvers } from './hello';

@ObjectType()
export class DefaultMutationResponse {
  @Field()
  success: boolean;
}

export const resolvers: BuildSchemaOptions = {
  resolvers: [BooksResolvers, HelloResolvers]
};
