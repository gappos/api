import { Query, Mutation, Resolver, Arg } from 'type-graphql';
import { Location, LocationInput } from '../../../models';
import { addLocation, getLocations, updateLocation } from './helpers';

@Resolver(() => Location)
export class LocationResolvers {
  @Query(() => [Location])
  async locations(): Promise<Location[]> {
    return getLocations();
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
