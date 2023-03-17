import { Arg, Field, InputType, Mutation, Resolver } from 'type-graphql';
import { PersonInput } from './person';
import { createBirth } from './helpers';

@InputType()
export class PersonBirthInput {
  @Field({ nullable: false })
  childAttributes: PersonInput;
  @Field({ nullable: true })
  motherId?: string;
  @Field({ nullable: true })
  fatherId?: string;
  @Field({ nullable: true })
  parentId?: string;
  @Field({ nullable: true })
  parent2Id?: string;
}

@Resolver()
export class PersonEventsResolvers {
  @Mutation(() => Boolean)
  async birth(@Arg('parents', () => PersonBirthInput) parents: PersonBirthInput): Promise<boolean> {
    return createBirth(parents);
  }
}
