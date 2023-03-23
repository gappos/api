import { Arg, Mutation, Resolver } from 'type-graphql';

import { ChildAttributesInput } from '../types';
import { addChildRelations } from './helpers';

@Resolver()
export class ChildResolvers {
  @Mutation(() => Boolean)
  async addChild(
    @Arg('childAttributes', () => ChildAttributesInput) childAttributes: ChildAttributesInput,
  ): Promise<boolean> {
    return addChildRelations(childAttributes);
  }
}
