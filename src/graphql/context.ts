import DataLoader from 'dataloader';
import { Op } from 'sequelize';
import { Location } from '../models';

export interface Context {
  placeLoader: DataLoader<string, Location>;
}

export const graphqlContext = (): Context => ({
  placeLoader: new DataLoader(
    async (keys: readonly string[]): Promise<ArrayLike<Location | Error>> => {
      const locations = await Location.findAll({ where: { id: { [Op.in]: keys } } });

      const locationsById = locations.reduce(
        (acc, location) => ((acc[location.id] = location), acc),
        {} as Record<string, Location>,
      );
      return keys.map((key) => locationsById[key]);
    },
  ),
});
