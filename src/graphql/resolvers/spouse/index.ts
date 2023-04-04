import { Arg, Mutation, Resolver } from 'type-graphql';

import { SpouseInput } from '../types';
import { addSpouseRelations, updateSpouseRelations } from './helpers';
import { dsSpouseInput } from '../../../deserialize';
import { Spouse } from '../../../models';

@Resolver()
export class SpouseResolvers {
  @Mutation(() => Spouse)
  async addSpouse(
    @Arg('spouseAttributes', () => SpouseInput) spouseAttributes: SpouseInput,
  ): Promise<Spouse | null> {
    return addSpouseRelations(dsSpouseInput(spouseAttributes));
  }

  @Mutation(() => Spouse)
  async updateSpouse(
    @Arg('spouseAttributes', () => SpouseInput) spouseAttributes: SpouseInput,
  ): Promise<Spouse | null> {
    return updateSpouseRelations(dsSpouseInput(spouseAttributes));
  }
}
