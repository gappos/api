import { Field, ObjectType, Query, Resolver } from 'type-graphql';

@ObjectType('HelloWorld')
class HelloWorld {
  @Field()
  message: string;
}

@Resolver()
export class HelloResolvers {
  @Query(() => HelloWorld)
  async helloMessage() {
    return { message: 'Hello World!' };
  }
  @Query(() => String)
  async hello() {
    return 'Hello World!';
  }
}
