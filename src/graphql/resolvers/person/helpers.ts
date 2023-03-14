import { Op } from 'sequelize';

import { Person, PersonCreationAttributes, PersonInput, Spouse } from '../../../models';
import { logger } from '../../../utils';

const log = logger('Person');

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

export const getSpouses = async (partner: Person): Promise<Person[]> => {
  try {
    const spousesIds = (
      await Spouse.findAll({
        where: {
          [Op.or]: [{ partner1Id: partner.id }, { partner2Id: partner.id }],
        },
      })
    ).map((spouse) => (spouse.partner1Id === partner.id ? spouse.partner2Id : spouse.partner1Id));

    return Person.findAll({
      where: { id: { [Op.in]: spousesIds } },
    });
  } catch (error) {
    log.error('findAll', (error as Error).message);
  }
  return Promise.reject([]);
};
