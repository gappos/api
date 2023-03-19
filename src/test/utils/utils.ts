import DataLoader from 'dataloader';
import { Context } from '../../graphql';
import {
  Child,
  Gender,
  Location,
  LocationAttributes,
  ParentRelation,
  Person,
  PersonCreationAttributes,
  Spouse,
} from '../../models';

export const randomString = () => '' + Math.random();

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

export const createFamilyForTest = () => {
  const home = createLocationForTest();
  const father = createPersonForTest(home.id, home.id);
  const mother = createPersonForTest(home.id, home.id);
  const child = createPersonForTest(home.id, home.id);
  const spouse = new Spouse({ partner1Id: father.id, partner2Id: mother.id, wedding: new Date() });
  const childFather = new Child({
    childId: child.id,
    parentId: father.id,
    relation: ParentRelation.FATHER,
  });
  const childMother = new Child({
    childId: child.id,
    parentId: mother.id,
    relation: ParentRelation.MOTHER,
  });

  return { home, father, mother, child, spouse, childFather, childMother };
};
