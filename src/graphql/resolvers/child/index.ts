import { Arg, Mutation, Resolver } from 'type-graphql';

import { ChildInput, ChildRelationsInput } from '../types';
import { addChild, addChildRelations } from './helpers';
import { Child } from '../../../models';

@Resolver()
export class ChildResolvers {
  @Mutation(() => Child)
  async addChild(
    @Arg('childAttributes', () => ChildInput) childAttributes: ChildInput,
  ): Promise<Child | null> {
    return addChild(childAttributes);
  }

  @Mutation(() => Boolean)
  async addChildRelations(
    @Arg('childRelationsAttributes', () => ChildRelationsInput)
    childRelationsAttributes: ChildRelationsInput,
  ): Promise<Array<Child | null>> {
    return addChildRelations(childRelationsAttributes);
  }
}
