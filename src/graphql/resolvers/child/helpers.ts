import { Child, ParentRelation } from '../../../models';
import { ChildAttributesInput } from '../types';

export const addChildRelations = async ({
  childId,
  parent1Id,
  parent1relation,
  parent2Id,
  parent2relation,
}: ChildAttributesInput): Promise<boolean> => {
  if (parent1Id) {
    const relation = parent1relation || ParentRelation.PARENT;
    await Child.create({ childId, parentId: parent1Id, relation });
  }

  if (parent2Id) {
    const relation = parent2relation || ParentRelation.PARENT;
    await Child.create({ childId, parentId: parent2Id, relation });
  }

  if (parent1Id || parent2Id) return true;
  return false;
};
