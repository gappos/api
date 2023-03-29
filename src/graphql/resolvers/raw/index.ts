import { Arg, Mutation, Resolver } from 'type-graphql';

import { getSequelize } from '../../../db/sequelize';
import { logger } from '../../../utils';

@Resolver()
export class RawResolvers {
  @Mutation(() => String)
  async raw(@Arg('sql') sql: string): Promise<string> {
    try {
      return JSON.stringify(await getSequelize().query(sql), null, 2);
    } catch (error) {
      logger('Sequelize').error('query', error);
    }
    return 'Something gone wrong';
  }
}
