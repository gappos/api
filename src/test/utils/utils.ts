import DataLoader from 'dataloader';
import { Context } from '../../graphql';
import {
  Gender,
  Location,
  LocationAttributes,
  Person,
  PersonCreationAttributes,
} from '../../models';

const randomString = () => '' + Math.random();

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
  peopleLivingLoader: {} as DataLoader<string, Person[], string>,
  peopleBornLoader: {} as DataLoader<string, Person[], string>,
});

export const createPersonForTest = (placeId?: string, pobId?: string) =>
  new Person({
    firstName: randomString(),
    lastName: randomString(),
    gender: Math.random() >= 0.5 ? Gender.MALE : Gender.FEMALE,
    dob: new Date(),
    placeId,
    pobId,
  });

export const createLocationForTest = () =>
  new Location({
    country: randomString(),
    city: randomString(),
  });
