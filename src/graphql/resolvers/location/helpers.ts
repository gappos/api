import { Op } from 'sequelize';

import { Location, LocationCreationAttributes, Person } from '../../../models';
import { LocationInput } from '../types';
import { logger } from '../../../utils';

const log = logger('Location');

export const getLocations = async (): Promise<Location[]> => {
  try {
    // return await Location.findAll();
    return await Location.findAll({
      include: [
        {
          model: Person,
          as: 'personsLiving',
          foreignKey: 'placeId',
          where: { dod: { [Op.is]: null } },

          required: false,
        },
        {
          model: Person,
          as: 'personsBorn',
          foreignKey: 'pobId',
          where: { dod: { [Op.is]: null } },
          required: false,
        },
      ],
    });
  } catch (error) {
    throw error;
  }
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
