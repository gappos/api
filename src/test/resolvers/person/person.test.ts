import { expect } from 'expect';
import { SinonStub, stub } from 'sinon';

import { Gender, Person, PersonInput, Location, Spouse } from '../../../models';
import { PersonResolvers } from '../../../graphql';
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

      before(async () => {
        await family.home.save();
        await family.father.save();
        await family.mother.save();
        await family.child.save();
        await family.spouse.save();
        await family.childFather.save();
        await family.childMother.save();
      });

      after(async () => {
        Spouse.destroy({ where: {} });
        Person.destroy({ where: {} });
        Location.destroy({ where: {} });
      });

      it('should return spouse for father', async () => {
        const spouses = await resolver.spouses(family.father);

        expect(spouses.map(({ dataValues }) => dataValues)).toEqual([family.mother.dataValues]);
      });

      it('should return spouse for mother', async () => {
        const spouses = await resolver.spouses(family.mother);

        expect(spouses.map(({ dataValues }) => dataValues)).toEqual([family.father.dataValues]);
      });

      it('should return parents for child', async () => {
        const parents = await resolver.parents(family.child);

        expect(parents.map(({ dataValues }) => dataValues).sort()).toEqual(
          [family.father.dataValues, family.mother.dataValues].sort(),
        );
      });

      it('should return children for parent', async () => {
        const children = await resolver.children(family.mother);

        expect(children.map(({ dataValues }) => dataValues)).toEqual([family.child.dataValues]);
      });
    });
  });
});
