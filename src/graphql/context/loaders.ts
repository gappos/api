import DataLoader from 'dataloader';
import { Op } from 'sequelize';

import { Location, Person } from '../../models';

type PeopleAtLocation = { locationId: string; people: Person[] };

export const getPeopleAtLocations = async (
  locationIds: readonly string[],
  key: string,
): Promise<PeopleAtLocation[]> =>
  await Promise.all(
    locationIds.map(async (locationId) => ({
      locationId,
      people: await Person.findAll({ where: { [key]: locationId } }),
    })),
  );

export class PeopleLoader extends DataLoader<string, Person[]> {
  constructor(key: string) {
    super(async (locationIds: readonly string[]) => {
      const people = await getPeopleAtLocations(locationIds, key);

      const sorted = locationIds.map(
        (id) => people.find((personsAtLocation) => personsAtLocation.locationId === id)?.people,
      );

      return sorted as Person[][];
    });
  }
}

export const placesLoader = async (
  keys: readonly string[],
): Promise<ArrayLike<Location | Error>> => {
  const locations = await Location.findAll({ where: { id: { [Op.in]: keys } } });

  const locationsById = locations.reduce(
    (acc, location) => ((acc[location.id] = location), acc),
    {} as Record<string, Location>,
  );
  return keys.map((key) => locationsById[key]);
};
