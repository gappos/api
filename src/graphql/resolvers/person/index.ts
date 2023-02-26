import { Arg, Mutation, Query, Resolver } from 'type-graphql';

import { Person, PersonInput } from '../../../models';
import { getPersons, addPerson, updatePerson } from './helpers';

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
    return await addPerson(personAttributes);
  }

  @Mutation(() => Boolean)
  async updatePerson(
    @Arg('id') id: string,
    @Arg('personAttributes', () => PersonInput) personAttributes: PersonInput,
  ) {
    return await updatePerson(id, personAttributes);
  }
}
