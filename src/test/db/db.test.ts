import expect from 'expect';

import { getTestSequelize } from '../utils/testSequelize';

describe('check if database is connected', () => {
  it('should respond properly', async () => {
    const sequelize = await getTestSequelize();
    const request = 'Are you alive?';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [[{ response }]]: any = await sequelize.query(`SELECT '${request}' as response`);
    expect(response).toBe(request);
  });
});
