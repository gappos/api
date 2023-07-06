import { expect } from 'expect';
import { SinonStub, stub } from 'sinon';

import { Country, Location } from '../../../models';
import { LocationResolvers, LocationInput } from '../../../graphql';
import {
  clearDB,
  createLocationForTest,
  createPersonForTest,
  getContextForTest,
} from '../../utils/utils';

describe('LocationResolvers', () => {
  const resolver = new LocationResolvers();
  let locationModelStub: SinonStub;

  const location = createLocationForTest();

  const locationAttributes: LocationInput = {
    country: '',
    city: '',
    place: '',
  };

  describe('allLocations', () => {
    before(() => {
      locationModelStub = stub(Location, 'findAll');
    });

    after(() => {
      locationModelStub.restore();
    });

    it('should return an array of locations', async () => {
      const expectedLocations: Location[] = [];
      locationModelStub.resolves(expectedLocations);

      const actualLocations = await resolver.allLocations();

      expect(actualLocations).toEqual(expectedLocations);
    });
  });

  describe('addLocation', () => {
    let locationModelStubForFindAll: SinonStub;
    before(async () => {
      locationModelStub = stub(Location, 'create').resolves(location);
    });

    after(() => {
      locationModelStub.restore();
      locationModelStubForFindAll.restore();
    });

    afterEach(() => {
      locationModelStub.reset();
    });

    it('should return true', async () => {
      const result = await resolver.addLocation(locationAttributes);

      expect(result).toEqual(location);
    });

    it('should be called with proper arg', async () => {
      await resolver.addLocation(locationAttributes);

      const calledAttributesProps = Object.keys(locationModelStub.args[0][0]).sort();
      const expectedAttributesProps = Object.keys(locationAttributes).sort();
      expect(calledAttributesProps).toEqual(expectedAttributesProps);
    });

    it('should throw an error, if locations already exists', async () => {
      locationModelStubForFindAll = stub(Location, 'findAll').resolves([location]);

      try {
        await resolver.addLocation(locationAttributes);
        throw new Error('Failed to throw an Error');
      } catch (error) {
        expect((error as Error).message).toBe('Location already exists');
      }
    });
  });

  describe('updateLocation', () => {
    let result: Location | null;
    const id = 'blah-blah';
    let findByPkLocationStub: SinonStub;

    before(async () => {
      locationModelStub = stub(Location, 'update').resolves([1]);
      findByPkLocationStub = stub(Location, 'findByPk').resolves(location);

      result = await resolver.updateLocation(id, locationAttributes);
    });

    after(() => {
      locationModelStub.restore();
      findByPkLocationStub.restore();
    });

    it('should return location', async () => {
      expect(result).toEqual(location);
    });

    it('should be called with proper arg', async () => {
      const calledId = locationModelStub.args[0][1];
      expect(calledId).toEqual({ where: { id } });

      const calledAttributesProps = Object.keys(locationModelStub.args[0][0]).sort();
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

  describe('countries', () => {
    const dataStructure = [
      { country: 'country1', cities: ['1', '2', '3'], places: ['4', '5'] },
      { country: 'country2', cities: ['6', '7'], places: [] },
      { country: 'country3', cities: [], places: ['8', '9'] },
    ];
    let countries: Country[];

    before(async () => {
      await clearDB();
      await Promise.all(
        dataStructure.reduce(
          (locations: Promise<Location>[], { country, cities, places }) => [
            ...locations,
            ...cities.map((city) => createLocationForTest(country, false, city).save()),
            ...places.map((place) => createLocationForTest(country, true, place).save()),
          ],
          [],
        ),
      );

      countries = await new LocationResolvers().countries();
    });

    after(async () => {
      await clearDB();
    });

    it('should fetch 9 locations', async () => {
      expect((await Location.findAll()).length).toEqual(9);
    });

    it('should fetch 3 countries', () => {
      expect(countries.length).toBe(3);
    });

    it('should be 3 cities and 2 places in country1', () => {
      const country = countries.find(({ country }) => country === 'country1');
      expect(country).toBeTruthy();
      expect(country?.cities.length).toBe(3);
      expect(country?.places.length).toBe(2);
    });

    it('should be 2 cities and no places in country2', () => {
      const country = countries.find(({ country }) => country === 'country2');
      expect(country).toBeTruthy();
      expect(country?.cities.length).toBe(2);
      expect(country?.places.length).toBe(0);
    });

    it('should be no cities and 2 places in country3', () => {
      const country = countries.find(({ country }) => country === 'country3');
      expect(country).toBeTruthy();
      expect(country?.cities.length).toBe(0);
      expect(country?.places.length).toBe(2);
    });
  });
});
