import { Field, ObjectType, Query, Resolver } from "type-graphql";

@ObjectType("HelloWorld")
class HelloWorld {
  @Field()
  message: string;
}

@Resolver()
export class HelloResolvers {
  // @ts-ignore:
  @Query((returns) => HelloWorld)
  async helloMessage() {
    return { message: "Hello World!" };
  }
  // @ts-ignore:
  @Query((returns) => String)
  async hello() {
    return "Hello World!";
  }
}
