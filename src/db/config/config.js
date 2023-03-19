module.exports = {
  development: {
    use_env_variable: 'DB_CONNECTION_STRING',
    dialect: 'postgres',
  },
  test: {
    use_env_variable: 'DB_CONNECTION_STRING_TEST',
    dialect: 'postgres',
  },
  migration: {
    use_env_variable: 'DB_CONNECTION_STRING',
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'DB_CONNECTION_STRING',
    dialect: 'postgres',
  },
};
