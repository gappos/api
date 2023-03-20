import { Arg, Mutation, Resolver } from 'type-graphql';

import { PersonBirthInput, PersonMarriageInput } from '../types';
import {
  createBirth,
  createMarriage,
  divorcePartner,
  updatePerson,
  updatePersonLocation,
} from './helpers';

@Resolver()
export class PersonEventsResolvers {
  @Mutation(() => Boolean)
  async birth(@Arg('parents', () => PersonBirthInput) parents: PersonBirthInput): Promise<boolean> {
    return await createBirth(parents);
  }

  @Mutation(() => Boolean)
  async death(@Arg('personId') personId: string): Promise<boolean> {
    return await updatePerson(personId, { dod: new Date().toISOString() });
  }

  @Mutation(() => Boolean)
  async marriage(
    @Arg('couple', () => PersonMarriageInput) couple: PersonMarriageInput,
  ): Promise<boolean> {
    return await createMarriage(couple);
  }

  @Mutation(() => Boolean)
  async divorce(@Arg('partner') partnerId: string): Promise<boolean> {
    return await divorcePartner(partnerId);
  }

  @Mutation(() => Boolean)
  async relocate(
    @Arg('personId') personId: string,
    @Arg('locationId') locationId: string,
  ): Promise<boolean> {
    return await updatePersonLocation(personId, locationId);
  }
}
