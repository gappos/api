import DataLoader from 'dataloader';
import { Op } from 'sequelize';

import { Location, Person } from '../../models';

export const getPeopleLoader =
  (key: 'placeId' | 'pobId'): DataLoader.BatchLoadFn<string, Person[]> =>
  async (locationIds: readonly string[]) => {
    const people = await Person.findAll({ where: { [key]: { [Op.in]: locationIds } } });

    const peopleByPlaceId: { [locationId: string]: Person[] } = people.reduce(
      (acc: { [locationId: string]: Person[] }, person: Person) => {
        if (!acc[person[key]]) {
          acc[person[key]] = [];
        }
        acc[person[key]].push(person);
        return acc;
      },
      {},
    );

    return locationIds.map((locationId) => peopleByPlaceId[locationId] || []);
  };

export const getPlacesLoader =
  (): DataLoader.BatchLoadFn<string, Location> =>
  async (keys: readonly string[]): Promise<ArrayLike<Location | Error>> => {
    const locations = await Location.findAll({ where: { id: { [Op.in]: keys } } });

    const locationsById = locations.reduce(
      (acc, location) => ((acc[location.id] = location), acc),
      {} as Record<string, Location>,
    );
    return keys.map((key) => locationsById[key]);
  };
