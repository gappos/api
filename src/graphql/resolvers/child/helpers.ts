import { Child, ChildAttributes, ParentRelation } from '../../../models';
import { ChildInput, ChildRelationsInput } from '../types';
import { logger } from '../../../utils';

const log = logger('Child');

export const addChildRelations = async ({
  childId,
  parent1Id,
  parent1relation,
  parent2Id,
  parent2relation,
}: ChildRelationsInput): Promise<Array<Child | null>> => {
  const childRelations: Array<Child | null> = [];

  if (parent1Id) {
    const relation = parent1relation || ParentRelation.PARENT;
    childRelations.push(await addChild({ childId, parentId: parent1Id, relation }));
  }

  if (parent2Id) {
    const relation = parent2relation || ParentRelation.PARENT;
    childRelations.push(await addChild({ childId, parentId: parent2Id, relation }));
  }

  return childRelations;
};

export const addChild = async (childAttributes: ChildInput): Promise<Child | null> => {
  try {
    return await Child.create(childAttributes as ChildAttributes);
  } catch (error) {
    log.error('create', (error as Error).message);
  }
  return null;
};
