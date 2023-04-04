import { Spouse, SpouseAttributes } from '../../../models';

import { logger } from '../../../utils';

const log = logger('Spouse');

export const addSpouseRelations = async (
  spouseAttributes: SpouseAttributes,
): Promise<Spouse | null> => {
  try {
    return await Spouse.create(spouseAttributes);
  } catch (error) {
    log.error('create', (error as Error).message);
  }
  return null;
};

export const updateSpouseRelations = async (
  spouseAttributes: Partial<SpouseAttributes>,
): Promise<Spouse | null> => {
  const whereId = {
    where: { partner1Id: spouseAttributes.partner1Id, partner2Id: spouseAttributes.partner2Id },
  };

  try {
    const [num] = await Spouse.update(spouseAttributes, whereId);
    if (num === 0) return null;
  } catch (error) {
    log.error('update', (error as Error).message);
  }

  try {
    return await Spouse.findOne(whereId);
  } catch (error) {
    log.error('findOne', (error as Error).message);
  }

  return null;
};
