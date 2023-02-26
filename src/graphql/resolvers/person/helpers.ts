import { Location, Person, PersonCreationAttributes, PersonInput } from '../../../models';

const log = (method: string, errorMsg: string) =>
  console.log(`ERROR {model: Person, method: ${method}}}:`, errorMsg);

export const getPersons = (): Promise<Person[]> => {
  try {
    return Person.findAll({
      include: [
        { model: Location, as: 'place', foreignKey: 'placeId' },
        { model: Location, as: 'placeOfBirth', foreignKey: 'pobId' },
      ],
    });
  } catch (error) {
    log('findAll', (error as Error).message);
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
    log('create', (error as Error).message);
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
    log('update', (error as Error).message);
  }
  return false;
};
