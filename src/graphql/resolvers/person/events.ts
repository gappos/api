import { Arg, Mutation, Resolver } from 'type-graphql';

import { PersonBirthInput } from '../types';
import { createBirth, updatePerson } from './helpers';

@Resolver()
export class PersonEventsResolvers {
  @Mutation(() => Boolean)
  async birth(@Arg('parents', () => PersonBirthInput) parents: PersonBirthInput): Promise<boolean> {
    return createBirth(parents);
  }

  @Mutation(() => Boolean)
  async death(@Arg('personId') personId: string): Promise<boolean> {
    return await updatePerson(personId, { dod: new Date().toISOString() });
  }
}
