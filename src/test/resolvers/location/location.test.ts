import { expect } from 'expect';
import { SinonStub, stub } from 'sinon';

import { Location } from '../../../models';
import { LocationResolvers, LocationInput } from '../../../graphql';
import { createLocationForTest, createPersonForTest, getContextForTest } from '../../utils/utils';

describe('LocationResolvers', () => {
  let resolver: LocationResolvers;
  let resolverStub: SinonStub;

  const location = createLocationForTest();

  const locationAttributes: LocationInput = {
    country: '',
    city: '',
    place: '',
  };

  describe('locations', () => {
    before(() => {
      resolver = new LocationResolvers();
      resolverStub = stub(Location, 'findAll');
    });

    after(() => {
      resolverStub.restore();
    });

    it('should return an array of locations', async () => {
      const expectedLocations: Location[] = [];
      resolverStub.resolves(expectedLocations);

      const actualLocations = await resolver.locations();

      expect(actualLocations).toEqual(expectedLocations);
    });
  });

  describe('addLocation', () => {
    let result: Location | null;

    before(async () => {
      resolver = new LocationResolvers();
      resolverStub = stub(Location, 'create').resolves(location);

      result = await resolver.addLocation(locationAttributes);
    });

    after(() => {
      resolverStub.restore();
    });

    it('should return true', async () => {
      expect(result).toEqual(location);
    });

    it('should be called with proper arg', async () => {
      const calledAttributesProps = Object.keys(resolverStub.args[0][0]).sort();
      const expectedAttributesProps = Object.keys(locationAttributes).sort();
      expect(calledAttributesProps).toEqual(expectedAttributesProps);
    });
  });

  describe('updateLocation', () => {
    let result: Location | null;
    const id = 'blah-blah';
    let findByPkLocationStub: SinonStub;

    before(async () => {
      resolver = new LocationResolvers();
      resolverStub = stub(Location, 'update').resolves([1]);
      findByPkLocationStub = stub(Location, 'findByPk').resolves(location);

      result = await resolver.updateLocation(id, locationAttributes);
    });

    after(() => {
      resolverStub.restore();
      findByPkLocationStub.restore();
    });

    it('should return location', async () => {
      expect(result).toEqual(location);
    });

    it('should be called with proper arg', async () => {
      const calledId = resolverStub.args[0][1];
      expect(calledId).toEqual({ where: { id } });

      const calledAttributesProps = Object.keys(resolverStub.args[0][0]).sort();
      const expectedAttributesProps = ['country', 'city', 'place'].sort();
      expect(calledAttributesProps).toEqual(expectedAttributesProps);
    });
  });

  describe('field resolvers', () => {
    const locationResolvers = new LocationResolvers();
    const ctx = getContextForTest();
    const parent = createLocationForTest();
    const people = [
      createPersonForTest(parent.id, parent.id),
      createPersonForTest(parent.id, parent.id),
    ];

    it('peopleLiving should return an array of people living in the given location', async () => {
      ctx.peopleLivingLoader.load = () => Promise.resolve(people);

      const result = await locationResolvers.personsLiving(parent, ctx);
      expect(result).toEqual(people);
    });

    it('peopleBorn should return an array of people born in the given location', async () => {
      ctx.peopleBornLoader.load = () => Promise.resolve(people);

      const result = await locationResolvers.personsLiving(parent, ctx);
      expect(result).toEqual(people);
    });
  });
});
