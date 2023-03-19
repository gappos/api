import { Arg, Mutation, Resolver } from 'type-graphql';

import { PersonBirthInput } from '../types';
import { createBirth } from './helpers';

@Resolver()
export class PersonEventsResolvers {
  @Mutation(() => Boolean)
  async birth(@Arg('parents', () => PersonBirthInput) parents: PersonBirthInput): Promise<boolean> {
    return createBirth(parents);
  }
}
