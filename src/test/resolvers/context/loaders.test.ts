import expect from 'expect';

import { LocationResolvers } from '../../../graphql/resolvers/location';
import { PersonResolvers } from '../../../graphql/resolvers/person';
import { Location, Person } from '../../../models';
import { createLocationForTest, createPersonForTest } from '../../utils/utils';

describe('context for resolvers', () => {
  const places = [createLocationForTest(), createLocationForTest()];
  const people = [
    createPersonForTest(places[0].id, places[1].id),
    createPersonForTest(places[0].id, places[1].id),
    createPersonForTest(places[0].id, places[1].id),
  ];
  const personResolvers = new PersonResolvers();
  const locationResolvers = new LocationResolvers();

  after(() => {
    Person.destroy({ where: {} });
    Location.destroy({ where: {} });
  });

  it('should load correct places for persons', async () => {
    const persons = await personResolvers.persons();
    persons.forEach((person) => {
      expect(person.place).toEqual(places[0]);
      expect(person.placeOfBirth).toEqual(places[1]);
    });
  });

  it('should load correct people for locations', async () => {
    const locations = await locationResolvers.locations();
    locations.forEach((location) => {
      expect(location.personsBorn).toEqual(people);
      expect(location.personsLiving).toEqual(people);
    });
  });
});
