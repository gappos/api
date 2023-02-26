import { Location, LocationCreationAttributes, LocationInput, Person } from '../../../models';

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

export const addLocation = async (locationAttributes: LocationInput): Promise<boolean> => {
  try {
    await Location.create(locationAttributes as LocationCreationAttributes);
    return true;
  } catch (error) {
    console.log('ERROR {model: Location, method: save}:', (error as Error).message);
  }
  return false;
};

export const updateLocation = async (id: string, attributes: LocationInput): Promise<boolean> => {
  try {
    Location.update(attributes as LocationCreationAttributes, { where: { id } });
    return true;
  } catch (error) {
    console.log('ERROR {model: Location, method: update}:', (error as Error).message);
  }
  return false;
};
