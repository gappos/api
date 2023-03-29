import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import dotenv from 'dotenv';

import { Location, Person, Child, Spouse } from '../../models';

dotenv.config();

let sequelize: Sequelize;

export const getTestSequelize = async (): Promise<Sequelize> => {
  if (sequelize) return sequelize;

  const testUri = process.env.DB_CONNECTION_STRING_TEST as string;
  if (!testUri) throw new Error("Connection to the test DB hasn't been set");

  const sequelizeOptions: SequelizeOptions = {
    logging: false,
    dialect: 'postgres',
  };
  sequelize = new Sequelize(testUri, sequelizeOptions);

  sequelize.addModels([Person, Location, Child, Spouse]);

  return sequelize;
};

(async () => await getTestSequelize())();
