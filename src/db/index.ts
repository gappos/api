import { Sequelize } from 'sequelize-typescript';

export default new Sequelize('gapp', 'postgres', 'postgres', {
  host: 'db',
  dialect: 'postgres'
});
