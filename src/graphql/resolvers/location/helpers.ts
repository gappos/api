import { Location, LocationCreationAttributes } from '../../../models';

export const getLocations = async (): Promise<Location[]> => {
  try {
    return await Location.findAll();
  } catch (error) {
    throw error;
  }
};

export const addLocation = async ({
  country,
  city,
  place,
}: LocationCreationAttributes): Promise<boolean> => {
  const location = new Location({ country, city, place });
  try {
    await location.save();
    return true;
  } catch (error) {
    console.log(
      'ERROR {model: Location, method: save}:',
      (error as Error).message,
    );
  }
  return false;
};
