import { expect } from 'expect';
import { SinonStub, stub } from 'sinon';

import { Gender, Person, PersonInput } from '../../../models';
import { PersonResolvers } from '../../../graphql/resolvers/person';

describe('PersonResolvers', () => {
  let resolver: PersonResolvers;
  let resolverStub: SinonStub;
  const personAttributes: PersonInput = {
    firstName: '',
    lastName: '',
    gender: Gender.FEMALE,
    dob: '',
    dod: '',
    placeId: '',
    pobId: '',
  };

  describe('persons', () => {
    before(() => {
      resolver = new PersonResolvers();
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
      resolver = new PersonResolvers();
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
    const id = 'blah-blah';

    before(async () => {
      resolver = new PersonResolvers();
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
});
