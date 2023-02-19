import { LocationAttributes, PersonCreationAttributes } from '../../models';

const getPersonAttributes = (
  personAttributes: PersonCreationAttributes,
  locationAttributes: LocationAttributes,
): PersonCreationAttributes => ({
  ...personAttributes,
  placeId: locationAttributes.id,
  pobId: locationAttributes.id,
});

export default getPersonAttributes;
