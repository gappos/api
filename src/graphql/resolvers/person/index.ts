import { Arg, Mutation, Query, Resolver } from 'type-graphql';

import { Person, PersonInput } from '../../../models';
import { getPersons, addPerson } from './helpers';

@Resolver(() => Person)
export class PersonResolvers {
  @Query(() => [Person])
  async persons(): Promise<Person[]> {
    return await getPersons();
  }

  @Mutation(() => Boolean)
  async addPerson(
    @Arg('personAttributes', () => PersonInput) personAttributes: PersonInput,
  ): Promise<boolean> {
    console.log('PersonResolvers:addPerson:\n', personAttributes);
    return await addPerson(personAttributes);
  }
}
