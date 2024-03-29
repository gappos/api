import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';

import { Location, Person } from '../../../models';
import { Context } from '../../context';
import { PeopleSearchInput, PersonInput } from '../types';
import { addPerson, getChildren, getParents, getPeople, getSpouses, updatePerson } from './helpers';

@Resolver(() => Person)
export class PersonResolvers {
  @Query(() => [Person])
  async persons(): Promise<Person[]> {
    return await Person.findAll();
  }

  @Query(() => [Person])
  async people(
    @Arg('searchOptions', () => PeopleSearchInput) searchOptions: PeopleSearchInput,
  ): Promise<Person[]> {
    return await getPeople(searchOptions);
  }

  @FieldResolver()
  @Query(() => [Person])
  async spouses(@Root() parent: Person) {
    return getSpouses(parent);
  }

  @FieldResolver()
  @Query(() => [Person])
  async parents(@Root() parent: Person) {
    return getParents(parent);
  }

  @FieldResolver()
  @Query(() => [Person])
  async children(@Root() parent: Person) {
    return getChildren(parent);
  }

  @FieldResolver()
  @Query(() => Location)
  async place(@Root() parent: Person, @Ctx() ctx: Context) {
    return parent.placeId ? await ctx.placeLoader.load(parent.placeId) : null;
  }

  @FieldResolver()
  @Query(() => Location)
  async placeOfBirth(@Root() parent: Person, @Ctx() ctx: Context) {
    return parent.pobId ? await ctx.placeLoader.load(parent.pobId) : null;
  }

  @Mutation(() => Person)
  async addPerson(
    @Arg('personAttributes', () => PersonInput) personAttributes: PersonInput,
  ): Promise<Person | null> {
    return await addPerson(personAttributes);
  }

  @Mutation(() => Person)
  async updatePerson(
    @Arg('id') id: string,
    @Arg('personAttributes', () => PersonInput) personAttributes: PersonInput,
  ): Promise<Person | null> {
    return await updatePerson(id, personAttributes);
  }
}
