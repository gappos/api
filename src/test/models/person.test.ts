import expect from 'expect';

import {
  Gender,
  Location,
  LocationCreationAttributes,
  Person,
  PersonCreationAttributes,
} from '../../models';
import getPersonAttributes from '../utils/getPersonAttributes';

describe('Person model', () => {
  const locationAttributes: LocationCreationAttributes = {
    country: 'Atlantis',
    city: 'Gotham',
    place: 'Valley',
  };
  const personAttributes: PersonCreationAttributes = {
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'The Orphan',
    gender: Gender.MALE,
    dob: new Date('2000-02-02'),
    dod: new Date('2023-02-02'),
  };
  let location: Location;

  before(async () => {
    location = await Location.create(locationAttributes);
  });

  beforeEach(async () => {
    await Person.destroy({ where: {} });
  });

  it('should create a new person', async () => {
    const person = await Person.create(
      getPersonAttributes(personAttributes, location.dataValues, location.dataValues),
    );

    expect(person.id).toBeDefined();
    expect(person.firstName).toBe(personAttributes.firstName);
    expect(person.lastName).toBe(personAttributes.lastName);
    expect(person.middleName).toBe(personAttributes.middleName);
    expect(person.gender).toBe(personAttributes.gender);
    expect(person.dob).toStrictEqual(personAttributes.dob);
    expect(person.placeId).toBe(location.id);
    expect(person.pobId).toBe(location.id);
  });

  it('should update an existing person', async () => {
    const person = await Person.create(
      getPersonAttributes(personAttributes, location.dataValues, location.dataValues),
    );
    const dod = new Date();

    await person.update({ dod });

    const updatedPerson = await Person.findByPk(person.id);

    expect(updatedPerson?.dataValues).toEqual({
      ...personAttributes,
      id: person.id,
      dod,
      placeId: location.id,
      pobId: location.id,
    });
  });

  it('should delete an existing person', async () => {
    const person = await Person.create(personAttributes);

    await person.destroy();

    const deletedPerson = await Person.findByPk(person.id);

    expect(deletedPerson).toBeFalsy();
  });
});
