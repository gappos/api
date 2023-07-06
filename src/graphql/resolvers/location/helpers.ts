import { Country, Location, LocationCreationAttributes } from '../../../models';
import { LocationInput, LocationSearch } from '../types';
import { InputToSearchOptions, inputToSearchOptions, logger } from '../../../utils';

const log = logger('Location');

export const getLocations = async (
  locationAttributes: Partial<LocationSearch>,
  options: InputToSearchOptions = {},
): Promise<Location[]> => {
  try {
    const searchOptions = inputToSearchOptions(locationAttributes, options);
    return await Location.findAll({ where: searchOptions });
  } catch (error) {
    log.error('create', (error as Error).message);
  }
  return [];
};

export const addLocation = async (locationAttributes: LocationInput): Promise<Location | null> => {
  try {
    return await Location.create(locationAttributes as LocationCreationAttributes);
  } catch (error) {
    log.error('create', (error as Error).message);
  }
  return null;
};

export const updateLocation = async (
  id: string,
  attributes: LocationInput,
): Promise<Location | null> => {
  try {
    const [num] = await Location.update(attributes as LocationCreationAttributes, {
      where: { id },
    });
    if (num === 0) return null;
  } catch (error) {
    log.error('update', (error as Error).message);
  }
  try {
    return await Location.findByPk(id);
  } catch (error) {
    log.error('findByPk', (error as Error).message);
  }
  return null;
};

export const getAllCountries = async (): Promise<Country[]> => {
  const locations = await Location.findAll();

  const countries = locations.reduce((countries: Country[], location) => {
    let country = countries.find(({ country }) => location.country === country);

    if (!country) {
      country = new Country(location.country);
      countries.push(country);
    }

    location.city && country.cities.push({ city: location.city, locationId: location.id });
    location.place && country.places.push({ place: location.place, locationId: location.id });

    return countries;
  }, []);

  return countries;
};

export const doesLocationExist = async (locationAttributes: LocationInput) => {
  return (
    (await getLocations(locationAttributes, { equalKeys: Object.keys(locationAttributes) }))
      .length !== 0
  );
};
