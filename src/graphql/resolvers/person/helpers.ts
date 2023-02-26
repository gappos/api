import { Location, Person, PersonCreationAttributes, PersonInput } from '../../../models';
import { logger } from '../../../utils';

const log = logger('Person');

export const getPersons = (): Promise<Person[]> => {
  try {
    return Person.findAll({
      include: [
        { model: Location, as: 'place', foreignKey: 'placeId' },
        { model: Location, as: 'placeOfBirth', foreignKey: 'pobId' },
      ],
    });
  } catch (error) {
    log.error('findAll', (error as Error).message);
  }
  return Promise.reject([]);
};

export const addPerson = async (attributes: PersonInput): Promise<boolean> => {
  const personAttributes: PersonCreationAttributes = {
    ...(attributes as unknown as PersonCreationAttributes),
    dob: new Date(attributes.dob),
    ...(attributes.dod ? { dod: new Date(attributes.dod) } : {}),
  };
  try {
    await Person.create(personAttributes);
    return true;
  } catch (error) {
    log.error('create', (error as Error).message);
  }
  return false;
};

export const updatePerson = async (id: string, attributes: PersonInput): Promise<boolean> => {
  const personAttributes: Partial<PersonCreationAttributes> = {
    ...(attributes as unknown as Partial<PersonCreationAttributes>),
    ...(attributes.dob ? { dob: new Date(attributes.dob) } : {}),
    ...(attributes.dod ? { dod: new Date(attributes.dod) } : {}),
  };
  try {
    Person.update(personAttributes, { where: { id } });
    return true;
  } catch (error) {
    log.error('update', (error as Error).message);
  }
  return false;
};
