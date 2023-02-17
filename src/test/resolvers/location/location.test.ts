import { expect } from 'expect';
import { SinonStub, stub } from 'sinon';

import { Location, LocationInput } from '../../../models';
import { LocationResolvers } from '../../../graphql/resolvers/location';

describe('LocationResolvers', () => {
  let resolver: LocationResolvers;
  let createStub: SinonStub;

  describe('locations', () => {
    before(() => {
      resolver = new LocationResolvers();
      createStub = stub(Location, 'findAll');
    });

    after(() => {
      createStub.restore();
    });

    it('should return an array of locations', async () => {
      const expectedLocations: unknown[] = [{}];
      createStub.resolves(expectedLocations);

      const actualLocations = await resolver.locations();

      expect(actualLocations).toEqual(expectedLocations);
    });
  });

  describe('addLocation', () => {
    let result: unknown;
    let locationAttributes: LocationInput;

    before(async () => {
      resolver = new LocationResolvers();
      createStub = stub(Location, 'create').resolves();

      locationAttributes = {
        country: '',
        city: '',
        place: '',
      };

      result = await resolver.addLocation(locationAttributes);
    });

    after(() => {
      createStub.restore();
    });

    it('should return true', async () => {
      expect(result).toBeTruthy();
    });

    it('should be called with proper arg', async () => {
      const calledAttributesProps = Object.keys(createStub.args[0][0]).sort();
      const expectedAttributesProps = ['country', 'city', 'place'].sort();
      expect(calledAttributesProps).toEqual(expectedAttributesProps);
    });
  });
});
