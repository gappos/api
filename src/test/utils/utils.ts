import DataLoader from 'dataloader';
import { Context, PeopleLoader } from '../../graphql';
import { Location, LocationAttributes, PersonCreationAttributes } from '../../models';

export const getPersonAttributes = (
  personAttributes: PersonCreationAttributes,
  placeLocationAttributes: LocationAttributes,
  pobLocationAttributes: LocationAttributes,
): PersonCreationAttributes => ({
  ...personAttributes,
  placeId: placeLocationAttributes.id,
  pobId: pobLocationAttributes.id,
});

export const getContextForTest = (): Context => ({
  placeLoader: {} as DataLoader<string, Location, string>,
  peopleLivingLoader: {} as PeopleLoader,
  peopleBornLoader: {} as PeopleLoader,
});
