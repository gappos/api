import { Location, LocationCreationAttributes, Person } from '../../../models';

export const getLocations = async (): Promise<Location[]> => {
  try {
    // return await Location.findAll();
    return await Location.findAll({
      include: [
        { model: Person, as: 'personsLiving', foreignKey: 'placeId' },
        { model: Person, as: 'personsBorn', foreignKey: 'pobId' },
      ],
    });
  } catch (error) {
    throw error;
  }
};

export const addLocation = async (
  locationAttributes: LocationCreationAttributes,
): Promise<boolean> => {
  try {
    await Location.create(locationAttributes);
    return true;
  } catch (error) {
    console.log('ERROR {model: Location, method: save}:', (error as Error).message);
  }
  return false;
};
