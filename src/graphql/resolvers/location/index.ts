import { Query, Mutation, Resolver, Arg, Args } from 'type-graphql';
import { Location, LocationArgs } from '../../../models';
import { addLocation, getLocations } from './helpers';

@Resolver(() => Location)
export class LocationResolvers {
  @Query(() => [Location])
  async locations(): Promise<Location[]> {
    return getLocations();
  }

  @Mutation(() => Boolean)
  async addLocation(
    @Arg('country') country: string,
    @Arg('city', { nullable: true }) city?: string,
    @Arg('place', { nullable: true }) place?: string,
  ): Promise<boolean> {
    return addLocation({ country, city, place });
  }

  @Mutation(() => Boolean)
  async doNothing(
    @Args(() => LocationArgs) args: typeof LocationArgs,
  ): Promise<boolean> {
    console.log('LocationResolvers:doNothing:\n', args);
    return true;
  }
}
