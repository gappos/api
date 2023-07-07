import { Op } from 'sequelize';

import {
  Child,
  Location,
  ParentRelation,
  Person,
  PersonCreationAttributes,
  Spouse,
} from '../../../models';
import { SearchOptions, inputToSearchOptions, isEmpty, logger } from '../../../utils';
import { PersonInput, PersonBirthInput, PersonMarriageInput, PeopleSearchInput } from '../types';

const log = logger('Person');

export const addPerson = async (attributes: PersonInput): Promise<Person | null> => {
  const personAttributes: PersonCreationAttributes = {
    ...(attributes as unknown as PersonCreationAttributes),
    dob: attributes.dob ? new Date(attributes.dob) : new Date(),
    ...(attributes.dod ? { dod: new Date(attributes.dod) } : {}),
  };
  try {
    return await Person.create(personAttributes);
  } catch (error) {
    log.error('create', (error as Error).message);
  }
  return null;
};

export const updatePerson = async (
  id: string,
  attributes: Partial<PersonInput>,
): Promise<Person | null> => {
  const personAttributes: Partial<PersonCreationAttributes> = {
    ...(attributes as unknown as Partial<PersonCreationAttributes>),
    ...(attributes.dob ? { dob: new Date(attributes.dob) } : {}),
    ...(attributes.dod ? { dod: new Date(attributes.dod) } : {}),
  };
  try {
    const [result] = await Person.update(personAttributes, { where: { id } });
    if (result === 0) return null;
  } catch (error) {
    log.error('update', (error as Error).message);
    return null;
  }
  try {
    return await Person.findByPk(id);
  } catch (error) {
    log.error('findByPk', (error as Error).message);
  }
  return null;
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

export const createBirth = async ({
  childAttributes,
  motherId,
  fatherId,
  parentId,
  parent2Id,
}: PersonBirthInput) => {
  let newBorn: Person | null = null;

  interface Parents {
    mainParentId?: string;
    secondParentId?: string;
  }
  const { mainParentId, secondParentId }: Parents = [
    motherId,
    fatherId,
    parentId,
    parent2Id,
  ].reduce((acc: Parents, parentId, idx, arr) => {
    if (parentId && !acc.mainParentId) acc.mainParentId = parentId;
    if (parentId && !acc.secondParentId && idx < arr.length - 1) acc.secondParentId = arr[idx + 1];
    return acc;
  }, {});

  const mainParent = mainParentId
    ? await Person.findByPk(mainParentId)
    : secondParentId && (await Person.findByPk(secondParentId));

  const pobId = (mainParent as Person)?.placeId;
  try {
    newBorn = await Person.create({
      ...(childAttributes as unknown as PersonCreationAttributes),
      dob: new Date(),
      ...(pobId ? { pobId, placeId: pobId } : {}),
    });
  } catch (error) {
    log.error('create', (error as Error).message);
  }
  if (!newBorn) return false;

  if (mainParentId) {
    const relation: ParentRelation =
      mainParentId === motherId
        ? ParentRelation.MOTHER
        : mainParentId === fatherId
        ? ParentRelation.FATHER
        : ParentRelation.PARENT;
    try {
      await Child.create({ childId: newBorn.id, parentId: mainParentId, relation });
    } catch (error) {
      logger('Child').error('create', (error as Error).message);
      return false;
    }
  }

  if (secondParentId) {
    const relation: ParentRelation =
      secondParentId === fatherId ? ParentRelation.FATHER : ParentRelation.PARENT;
    try {
      await Child.create({ childId: newBorn.id, parentId: secondParentId, relation });
    } catch (error) {
      logger('Child').error('create', (error as Error).message);
      return false;
    }
  }

  return true;
};

export const createMarriage = async (couple: PersonMarriageInput): Promise<boolean> => {
  try {
    await Spouse.create({
      partner1Id: couple.partner1Id,
      partner2Id: couple.partner2Id,
      wedding: new Date(),
    });
  } catch (error) {
    logger('Spouse').error('create', (error as Error).message);
    return false;
  }
  return true;
};

export const divorcePartner = async (partnerId: string): Promise<boolean> => {
  try {
    const marriage = await Spouse.findOne({
      where: { [Op.or]: [{ partner1Id: partnerId }, { partner2Id: partnerId }] },
    });

    if (!marriage) return false;

    await marriage.update({ divorce: new Date() });
  } catch (error) {
    logger('Spouse').error('update', (error as Error).message);
    return false;
  }
  return true;
};

export const updatePersonLocation = async (
  personId: string,
  locationId: string,
): Promise<boolean> => {
  try {
    await updatePerson(personId, { placeId: locationId });
    return true;
  } catch (error) {
    log.error('update', (error as Error).message);
  }
  return false;
};

export const getLocations = async (locationSearchObj: SearchOptions): Promise<Location[]> => {
  const searchObj = inputToSearchOptions(locationSearchObj);

  return isEmpty(searchObj) ? [] : await Location.findAll({ where: searchObj });
};

export const getPeople = async (searchOptions: PeopleSearchInput): Promise<Person[]> => {
  const equalKeys = Object.keys(
    searchOptions.person ? (searchOptions.person as SearchOptions) : [],
  ).filter((key) => key.includes('Id'));
  const personsSearchOptions = inputToSearchOptions(searchOptions?.person as SearchOptions, {
    equalKeys,
  });

  const places =
    !searchOptions?.person?.placeId && (await getLocations(searchOptions?.place as SearchOptions));
  if (places && places?.length) {
    personsSearchOptions.placeId = {
      [Op.in]: (places as unknown as Location[]).map(({ id }) => id),
    };
  }

  const placesOfBirth =
    !searchOptions?.person?.pobId &&
    (await getLocations(searchOptions?.placeOfBirth as SearchOptions));
  if (placesOfBirth && placesOfBirth?.length) {
    personsSearchOptions.pobId = {
      [Op.in]: (placesOfBirth as unknown as Location[]).map(({ id }) => id),
    };
  }

  return isEmpty(personsSearchOptions) ? [] : await Person.findAll({ where: personsSearchOptions });
};
