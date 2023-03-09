import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import dotenv from 'dotenv';

import { Book } from '../../models';
import { Location } from '../../models';
import { Person } from '../../models';

dotenv.config();

let sequelize: Sequelize;
let count = 0;

export const getTestSequelize = async (): Promise<Sequelize> => {
  if (sequelize) return sequelize;
  console.log(`getTestSequelize #${++count}`);

  const testUri = process.env.DB_CONNECTION_STRING_TEST as string;
  if (!testUri) throw new Error("Connection to the test DB hasn't been set");

  const sequelizeOptions: SequelizeOptions = {
    logging: false,
    dialect: 'postgres',
  };
  sequelize = new Sequelize(testUri, sequelizeOptions);

  // Define your models here
  sequelize.addModels([Book, Person, Location]);

  return sequelize;
};

(async () => await getTestSequelize())();
