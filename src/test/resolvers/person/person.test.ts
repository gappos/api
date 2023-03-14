import { expect } from 'expect';
import { SinonStub, stub } from 'sinon';

import { Gender, Person, PersonInput, Location, Spouse } from '../../../models';
import { PersonResolvers } from '../../../graphql/resolvers/person';
import * as personHelpers from '../../../graphql/resolvers/person/helpers';
import {
  createFamilyForTest,
  createLocationForTest,
  createPersonForTest,
  getContextForTest,
} from '../../utils/utils';

describe('PersonResolvers', () => {
  let resolver: PersonResolvers;
  let modelMethodStub: SinonStub;
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
      modelMethodStub = stub(Person, 'findAll');
    });

    after(() => {
      modelMethodStub.restore();
    });

    it('should return an array of persons', async () => {
      const expectedPersons: Person[] = [];
      modelMethodStub.resolves(expectedPersons);

      const actualPersons = await resolver.persons();

      expect(actualPersons).toEqual(expectedPersons);
    });
  });

  describe('addPerson', () => {
    let result: boolean;

    before(async () => {
      modelMethodStub = stub(Person, 'create').resolves();

      result = await resolver.addPerson(personAttributes);
    });

    after(() => {
      modelMethodStub.restore();
    });

    it('should return true', async () => {
      expect(result).toBe(true);
    });

    it('should be called with proper arg', async () => {
      const calledAttributesProps = Object.keys(modelMethodStub.args[0][0]).sort();
      const expectedAttributesProps = Object.keys(personAttributes).sort();
      expect(calledAttributesProps).toEqual(expectedAttributesProps);
    });
  });
  describe('updatePerson', () => {
    let result: boolean;

    before(async () => {
      modelMethodStub = stub(Person, 'update').resolves();

      result = await resolver.updatePerson(id, personAttributes);
    });

    after(() => {
      modelMethodStub.restore();
    });

    it('should return true', async () => {
      expect(result).toBe(true);
    });

    it('should be called with proper args', async () => {
      const calledId = modelMethodStub.args[0][1];
      expect(calledId).toEqual({ where: { id } });

      const calledAttributesProps = Object.keys(modelMethodStub.args[0][0]).sort();
      const expectedAttributesProps = Object.keys(personAttributes).sort();
      expect(calledAttributesProps).toEqual(expectedAttributesProps);
    });
  });

  describe('field resolvers', () => {
    describe('locations', () => {
      let place: Location;
      let placeOfBirth: Location;
      const ctx = getContextForTest();
      const location = createLocationForTest();
      const person = createPersonForTest(location.id, location.id);

      before(async () => {
        ctx.placeLoader.load = () => Promise.resolve(location);
        place = await resolver.place(person, ctx);
        placeOfBirth = await resolver.placeOfBirth(person, ctx);
      });

      it('place should return a location', () => {
        expect(place).toEqual(location);
      });

      it('placeOfBirth should return a location', () => {
        expect(placeOfBirth).toEqual(location);
      });
    });

    describe('family', () => {
      const family = createFamilyForTest();
      let getSpousesStub: SinonStub;

      before(async () => {
        Object.keys(family).forEach(async (key: string) =>
          family[key as keyof typeof family].save(),
        );
      });

      after(async () => {
        Spouse.destroy({ where: {} });
        Person.destroy({ where: {} });
        Location.destroy({ where: {} });
      });

      it('should return spouse for father', async () => {
        getSpousesStub = stub(personHelpers, 'getSpouses').resolves([family.mother]);
        const spouses = await resolver.spouses(family.father);
        getSpousesStub.restore();

        expect(spouses).toEqual([family.mother]);
      });

      it('should return spouse for mother', async () => {
        getSpousesStub = stub(personHelpers, 'getSpouses').resolves([family.father]);
        const spouses = await resolver.spouses(family.mother);
        getSpousesStub.restore();

        expect(spouses).toEqual([family.father]);
      });
    });
  });
});
