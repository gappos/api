import { Query, Mutation, Resolver, Arg, Ctx } from 'type-graphql';
import { Location, LocationInput } from '../../../models';
import { Context } from '../../context';
import { addLocation, getLocations, updateLocation } from './helpers';

@Resolver(() => Location)
export class LocationResolvers {
  @Query(() => [Location])
  async locations(@Ctx('dummy') dummy?: Partial<Context>): Promise<Location[]> {
    return dummy ? getLocations() : [];
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
