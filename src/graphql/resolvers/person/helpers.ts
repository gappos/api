import { Op } from 'sequelize';

import { Child, Person, PersonCreationAttributes, Spouse } from '../../../models';
import { logger } from '../../../utils';
import { PersonBirthInput } from './events';
import { PersonInput } from './person';

const log = logger('Person');

export const addPerson = async (attributes: PersonInput): Promise<boolean> => {
  const personAttributes: PersonCreationAttributes = {
    ...(attributes as unknown as PersonCreationAttributes),
    dob: attributes.dob ? new Date(attributes.dob) : new Date(),
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
    log.error('spouses', (error as Error).message);
  }
  return Promise.reject([]);
};

export const getParents = async (child: Person): Promise<Person[]> => {
  try {
    const parentsIds = (await Child.findAll({ where: { childId: child.id } })).map(
      ({ parentId }) => parentId,
    );
    return await Person.findAll({ where: { id: { [Op.in]: parentsIds } } });
  } catch (error) {
    log.error('children', (error as Error).message);
  }
  return Promise.reject([]);
};

export const getChildren = async (parent: Person): Promise<Person[]> => {
  try {
    const childrenIds = (await Child.findAll({ where: { parentId: parent.id } })).map(
      ({ childId }) => childId,
    );
    return await Person.findAll({ where: { id: { [Op.in]: childrenIds } } });
  } catch (error) {
    log.error('parents', (error as Error).message);
  }
  return Promise.reject([]);
};

export const createBirth = async (parents: PersonBirthInput) => {
  if (parents) return true;
  return false;
};
