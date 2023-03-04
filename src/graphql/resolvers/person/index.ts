import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';

import { Location, Person, PersonInput } from '../../../models';
import { Context } from '../../context';
import {
  // getPersons,
  addPerson,
  updatePerson,
} from './helpers';

@Resolver(() => Person)
export class PersonResolvers {
  @Query(() => [Person])
  async persons(): Promise<Person[]> {
    return await Person.findAll();
  }

  @FieldResolver()
  @Query(() => Location)
  async place(@Root() parent: Person, @Ctx() ctx: Context) {
    return await ctx.placeLoader.load(parent.placeId);
  }

  @FieldResolver()
  @Query(() => Location)
  async placeOfBirth(@Root() parent: Person, @Ctx() ctx: Context) {
    return await ctx.placeLoader.load(parent.pobId);
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
