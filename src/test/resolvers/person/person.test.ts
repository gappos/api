import { expect } from 'expect';
import { SinonStub, stub } from 'sinon';

import { Gender, Person, PersonInput, Location } from '../../../models';
import { PersonResolvers } from '../../../graphql/resolvers/person';
import { getContextForTest } from '../../utils/utils';

describe('PersonResolvers', () => {
  let resolver: PersonResolvers;
  let resolverStub: SinonStub;
  const id = 'blah-blah';
  const personAttributes: PersonInput = {
    firstName: '',
    lastName: '',
    gender: Gender.FEMALE,
    dob: '',
    dod: '',
    placeId: '',
    pobId: '',
  };

  before(() => {
    resolver = new PersonResolvers();
  });
  describe('persons', () => {
    before(() => {
      resolverStub = stub(Person, 'findAll');
    });

    after(() => {
      resolverStub.restore();
    });

    it('should return an array of persons', async () => {
      const expectedPersons: Person[] = [];
      resolverStub.resolves(expectedPersons);

      const actualPersons = await resolver.persons();

      expect(actualPersons).toEqual(expectedPersons);
    });
  });

  describe('addPerson', () => {
    let result: boolean;

    before(async () => {
      resolverStub = stub(Person, 'create').resolves();

      result = await resolver.addPerson(personAttributes);
    });

    after(() => {
      resolverStub.restore();
    });

    it('should return true', async () => {
      expect(result).toBe(true);
    });

    it('should be called with proper arg', async () => {
      const calledAttributesProps = Object.keys(resolverStub.args[0][0]).sort();
      const expectedAttributesProps = Object.keys(personAttributes).sort();
      expect(calledAttributesProps).toEqual(expectedAttributesProps);
    });
  });
  describe('updatePerson', () => {
    let result: boolean;

    before(async () => {
      resolverStub = stub(Person, 'update').resolves();

      result = await resolver.updatePerson(id, personAttributes);
    });

    after(() => {
      resolverStub.restore();
    });

    it('should return true', async () => {
      expect(result).toBe(true);
    });

    it('should be called with proper args', async () => {
      const calledId = resolverStub.args[0][1];
      expect(calledId).toEqual({ where: { id } });

      const calledAttributesProps = Object.keys(resolverStub.args[0][0]).sort();
      const expectedAttributesProps = Object.keys(personAttributes).sort();
      expect(calledAttributesProps).toEqual(expectedAttributesProps);
    });
  });

  describe('field resolvers', () => {
    let place: Location;
    let placeOfBirth: Location;
    const ctx = getContextForTest();
    const person = { ...personAttributes, id, dob: new Date(), dod: new Date() } as Person;
    const location = { country: '', city: '' } as Location;

    before(async () => {
      ctx.placeLoader.load = () => Promise.resolve(location);
      place = await resolver.place(person, ctx);
      placeOfBirth = await resolver.place(person, ctx);
    });

    it('place should return a location', () => {
      expect(place).toEqual(location);
    });

    it('placeOfBirth should return a location', () => {
      expect(placeOfBirth).toEqual(location);
    });
  });
});
