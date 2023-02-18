import expect from 'expect';
import { Sequelize } from 'sequelize-typescript';
import getTestSequelize from './utils/getTestSequelize';

let sequelize: Sequelize;

before(async () => {
  sequelize = await getTestSequelize();
});

after(async () => {
  await sequelize.drop();
  await sequelize.close();
});

describe('this is the setup', () => {
  describe('check if database is connected', () => {
    it('should respond properly', async () => {
      const request = 'Are you alive?';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [[{ response }]]: any = await sequelize.query(`SELECT '${request}' as response`);
      expect(response).toBe(request);
    });
  });
});
