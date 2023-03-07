import { Query, Mutation, Resolver, Arg, FieldResolver, Root, Ctx } from 'type-graphql';
import { Location, LocationInput, Person } from '../../../models';
import { Context } from '../../context';
import { addLocation, updateLocation } from './helpers';

@Resolver(() => Location)
export class LocationResolvers {
  @Query(() => [Location])
  async locations(): Promise<Location[]> {
    return await Location.findAll();
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

  @Mutation(() => Boolean)
  async addLocation(
    @Arg('locationAttributes', () => LocationInput)
    locationAttributes: LocationInput,
  ): Promise<boolean> {
    return addLocation(locationAttributes);
  }

  @Mutation(() => Boolean)
  async updateLocation(
    @Arg('id') id: string,
    @Arg('locationAttributes', () => LocationInput) locationAttributes: LocationInput,
  ) {
    return await updateLocation(id, locationAttributes);
  }
}
