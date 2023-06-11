import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import dotenv from 'dotenv';

import { Location, Person, Child, Spouse } from '../models';
import { logger } from '../utils';

dotenv.config();
const uri: string = process.env.DB_CONNECTION_STRING as string;
if (!uri) throw new Error("Connection to the DB hasn't been set");

let sequelize: Sequelize;
const models = [Person, Location, Child, Spouse];

export const getSequelize = (): Sequelize => {
  if (sequelize) return sequelize;

  const sequelizeOptions: SequelizeOptions = {
    logging: logger().sequelize,
    dialect: 'postgres',
  };
  sequelize = new Sequelize(uri, sequelizeOptions);
  sequelize.addModels(models);

  return sequelize;
};

(() => getSequelize())();
