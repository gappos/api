import { expect } from 'expect';
import { SinonStub, stub } from 'sinon';

import { Gender, Person, Location } from '../../../models';
import { PersonResolvers, PersonInput } from '../../../graphql';
import {
  clearDB,
  createFamilyForTest,
  createLocationForTest,
  createPeopleAtLocationForTest,
  createPersonForTest,
  getContextForTest,
} from '../../utils/utils';

describe('PersonResolvers', () => {
  let resolver: PersonResolvers;
  let modelMethodStub: SinonStub;
  const id = 'blah-blah';
  const person = createPersonForTest();
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
    let result: Person | null;

    before(async () => {
      modelMethodStub = stub(Person, 'create').resolves(person);

      result = await resolver.addPerson(personAttributes);
    });

    after(() => {
      modelMethodStub.restore();
    });

    it('should return person', async () => {
      expect(result).toEqual(person);
    });

    it('should be called with proper arg', async () => {
      const calledAttributesProps = Object.keys(modelMethodStub.args[0][0]).sort();
      const expectedAttributesProps = Object.keys(personAttributes).sort();
      expect(calledAttributesProps).toEqual(expectedAttributesProps);
    });
  });
  describe('updatePerson', () => {
    let result: Person | null;
    let findByPkMethodStub: SinonStub;

    before(async () => {
      modelMethodStub = stub(Person, 'update').resolves([1]);
      findByPkMethodStub = stub(Person, 'findByPk').resolves(person);

      result = await resolver.updatePerson(id, personAttributes);
    });

    after(() => {
      modelMethodStub.restore();
      findByPkMethodStub.restore();
    });

    it('should return person', async () => {
      expect(result).toEqual(person);
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
      let place: Location | null;
      let placeOfBirth: Location | null;
      const ctx = getContextForTest();
      const location = createLocationForTest();
      const person = createPersonForTest(location.id, location.id);

      describe('person has got set location ids', () => {
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
      describe('person has got set location ids to null', () => {
        before(async () => {
          ctx.placeLoader.load = () => Promise.resolve(null as unknown as Location);
          place = await resolver.place(person, ctx);
          placeOfBirth = await resolver.placeOfBirth(person, ctx);
        });

        it('place should return null', () => {
          expect(place).toBe(null);
        });

        it('placeOfBirth should return null', () => {
          expect(placeOfBirth).toBe(null);
        });
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
        await clearDB();
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

    describe('people', () => {
      let gotham: Location;
      let mordor: Location;

      before(async () => {
        gotham = await Location.create({
          country: 'Nowhere',
          city: 'Gotham',
        });
        mordor = await Location.create({
          country: 'Nowhere',
          place: 'Mordor',
        });
        await createPeopleAtLocationForTest({
          placeId: gotham.id,
          pobId: mordor.id,
          doSave: true,
          number: 2,
        });
      });
      after(async () => {
        await clearDB();
      });

      describe('empty search', () => {
        it('should return empty array of people', async () => {
          const people = await resolver.people({});

          expect(people.length).toBe(0);
        });
      });

      describe('returns people from the location', () => {
        describe('searching by setting the location of a person', () => {
          it('should return people living at the location', async () => {
            const people = await resolver.people({ person: { placeId: gotham.id } });

            expect(people.length).toBe(2);
            expect(people.every(({ placeId }) => placeId === gotham.id));
          });
          it('should return people born at the location', async () => {
            const people = await resolver.people({ person: { pobId: mordor.id } });

            expect(people.length).toBe(2);
            expect(people.every(({ pobId }) => pobId === mordor.id));
          });
        });
        describe('searching by setting attributes of location', () => {
          it('should return people living at the location', async () => {
            const people = await resolver.people({ place: { city: 'Gotham' } });

            expect(people.length).toBe(2);
            expect(people.every(({ placeId }) => placeId === gotham.id));
          });
          it('should return people born at the location', async () => {
            const people = await resolver.people({ placeOfBirth: { place: 'Mordor' } });

            expect(people.length).toBe(2);
            expect(people.every(({ placeId }) => placeId === mordor.id));
          });
          it('should return people living in the country', async () => {
            const people = await resolver.people({ place: { country: 'Nowhere' } });

            expect(people.length).toBe(2);
            expect(people.every(({ placeId }) => placeId === mordor.id && placeId === gotham.id));
          });
          it('should return people born in the country', async () => {
            const people = await resolver.people({ placeOfBirth: { country: 'Nowhere' } });

            expect(people.length).toBe(2);
            expect(people.every(({ pobId }) => pobId === mordor.id && pobId === gotham.id));
          });
          it('should return empty array if location not exists', async () => {
            const people = await resolver.people({ place: { country: 'Some Other County' } });

            expect(people.length).toBe(0);
          });
        });
      });
    });
  });
});
