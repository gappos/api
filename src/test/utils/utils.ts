import DataLoader from 'dataloader';
import { QueryTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

import { getTestSequelize } from './testSequelize';
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
import { range } from '../../utils';

export const randomString = () => ('' + Math.random()).substring(2);

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

export const createLocationForTest = (
  country = randomString(),
  place = false,
  name = randomString(),
) =>
  new Location({
    country,
    ...(place ? { place: name } : { city: name }),
  });

interface CreatePeopleAtLocationForTest {
  number?: number;
  doSave?: boolean;
  placeId?: string;
  pobId?: string;
}
export const createPeopleAtLocationForTest = async (
  { number, doSave, placeId, pobId }: CreatePeopleAtLocationForTest = {
    number: 2,
    doSave: false,
    placeId: uuidv4(),
    pobId: uuidv4(),
  },
) =>
  await Promise.all(
    range(number as number).map(async () => {
      const person = createPersonForTest(placeId, pobId);
      if (doSave) await person.save();
      return person;
    }),
  );

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

export const clearDB = async () => {
  const sequelize = await getTestSequelize();
  const query = `
  DO $$ DECLARE
    r RECORD;
  BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename != 'SequelizeMeta') LOOP
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE;';
    END LOOP;
  END $$;`;
  try {
    await sequelize.query(query, { type: QueryTypes.RAW });
  } catch (error) {
    console.error(error);
  }
};
