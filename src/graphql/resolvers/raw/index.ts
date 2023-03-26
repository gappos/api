import { Arg, Mutation, Resolver } from 'type-graphql';
import { QueryTypes } from 'sequelize';

import sequelize from '../../../db/sequelize';
import { logger } from '../../../utils';

@Resolver()
export class RawResolvers {
  @Mutation(() => String)
  async raw(@Arg('sql') sql: string): Promise<string> {
    try {
      const [result] = await sequelize.query(sql, { type: QueryTypes.RAW });
      return JSON.stringify(result, null, 2);
    } catch (error) {
      logger('Sequelize').error('query', error);
    }
    return 'Something gone wrong';
  }
}
