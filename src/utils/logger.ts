export const logger = (model?: string) => {
  const pref = (method: string) => `{ model:${model}, method:${method} }\n`;
  return {
    info: (method: string, ...args: unknown[]) => console.log('INFO:', pref(method), ...args),
    error: (method: string, ...args: unknown[]) => console.error('ERROR:', pref(method), ...args),
    sequelize: (sql: string) => console.log('Sequelize', sql),
  };
};
