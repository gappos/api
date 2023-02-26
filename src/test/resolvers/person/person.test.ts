import { expect } from 'expect';
import { SinonStub, stub } from 'sinon';

import { Gender, Person, PersonInput } from '../../../models';
import { PersonResolvers } from '../../../graphql/resolvers/person';

describe('PersonResolvers', () => {
  let resolver: PersonResolvers;
  let createStub: SinonStub;

  describe('persons', () => {
    before(() => {
      resolver = new PersonResolvers();
      createStub = stub(Person, 'findAll');
    });

    after(() => {
      createStub.restore();
    });

    it('should return an array of persons', async () => {
      const expectedPersons: unknown[] = [{}];
      createStub.resolves(expectedPersons);

      const actualPersons = await resolver.persons();

      expect(actualPersons).toEqual(expectedPersons);
    });
  });

  describe('addPerson', () => {
    let result: unknown;
    let personAttributes: PersonInput;

    before(async () => {
      resolver = new PersonResolvers();
      createStub = stub(Person, 'create').resolves();

      personAttributes = {
        firstName: '',
        lastName: '',
        gender: Gender.FEMALE,
        dob: '',
        dod: '',
        placeId: '',
        pobId: '',
      };

      result = await resolver.addPerson(personAttributes);
    });

    after(() => {
      createStub.restore();
    });

    it('should return true', async () => {
      expect(result).toBeTruthy();
    });

    it('should be called with proper arg', async () => {
      const calledAttributesProps = Object.keys(createStub.args[0][0]).sort();
      const expectedAttributesProps = Object.keys(personAttributes).sort();
      expect(calledAttributesProps).toEqual(expectedAttributesProps);
    });
  });
});
