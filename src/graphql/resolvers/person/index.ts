import { Arg, Mutation, Query, Resolver } from 'type-graphql';

import { Gender, Person } from '../../../models';
import { getPersons, addPerson } from './helpers';

@Resolver(() => Person)
export class PersonResolvers {
  @Query(() => [Person])
  async persons(): Promise<Person[]> {
    return await getPersons();
  }

  @Mutation(() => Boolean)
  async addPerson(
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('gender') gender: Gender,
    @Arg('dob') dob: string,
    @Arg('middleName', { nullable: true }) middleName?: string,
    @Arg('placeId', { nullable: true }) placeId?: string,
    @Arg('pobId', { nullable: true }) pobId?: string,
    @Arg('dod', { nullable: true }) dod?: string,
  ): Promise<boolean> {
    const person = {
      firstName,
      lastName,
      middleName,
      dob,
      gender,
      placeId,
      pobId,
      dod,
    };
    console.log('PersonResolvers:addPerson:\n', person);
    return await addPerson(person);
  }
}
