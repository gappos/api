import { Sequelize } from 'sequelize-typescript';

export const sequelize = new Sequelize('gapp', 'postgres', 'postgres', {
  host: 'db',
  logging: true,
  dialect: 'postgres'
});
