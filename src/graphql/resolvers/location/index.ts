import { Query, Mutation, Resolver, Arg, FieldResolver, Root, Ctx } from 'type-graphql';

import { Country, Location, Person } from '../../../models';
import { Context } from '../../context';
import { LocationInput } from '../types';
import {
  addLocation,
  doesLocationExist,
  getAllCountries,
  getLocations,
  updateLocation,
} from './helpers';

@Resolver(() => Location)
export class LocationResolvers {
  @Query(() => [Location])
  async allLocations(): Promise<Location[]> {
    return await Location.findAll();
  }

  @Query(() => [Location])
  async locations(
    @Arg('locationAttributes', () => LocationInput)
    locationAttributes: LocationInput,
  ): Promise<Location[]> {
    const result = await getLocations(locationAttributes);
    console.log('DEBUG:LocationResolvers:locations:result:', result);
    return result;
  }

  @FieldResolver()
  @Query(() => [Person])
  async personsLiving(@Root() parent: Location, @Ctx() ctx: Context) {
    return await ctx.peopleLivingLoader.load(parent.id);
  }

  @FieldResolver()
  @Query(() => [Person])
  async personsBorn(@Root() parent: Location, @Ctx() ctx: Context) {
    return await ctx.peopleBornLoader.load(parent.id);
  }

  @Query(() => [Country])
  async countries(): Promise<Country[]> {
    return await getAllCountries();
  }

  @Mutation(() => Location)
  async addLocation(
    @Arg('locationAttributes', () => LocationInput)
    locationAttributes: LocationInput,
  ): Promise<Location | null> {
    if (await doesLocationExist(locationAttributes)) throw new Error('Location already exists');

    return addLocation(locationAttributes);
  }

  @Mutation(() => Location)
  async updateLocation(
    @Arg('id') id: string,
    @Arg('locationAttributes', () => LocationInput) locationAttributes: LocationInput,
  ): Promise<Location | null> {
    return await updateLocation(id, locationAttributes);
  }
}
