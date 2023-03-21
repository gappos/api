import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import dotenv from 'dotenv';

import { Book, Location, Person, Child, Spouse } from '../models';
import { logger } from '../utils';

dotenv.config();
const uri: string = process.env.DB_CONNECTION_STRING as string;
const options: SequelizeOptions = {
  logging: logger().sequelize,
  dialect: 'postgres',
};

if (!uri) throw new Error("Connection to the DB hasn't been set");

const sequelize = new Sequelize(uri, options);

sequelize
  .authenticate()
  .then(() => console.log(`Connected to DB using ${uri}`))
  .catch((error) => console.error('Failed to connect to DB\n', error));

const models = [Book, Location, Person, Child, Spouse];
sequelize.addModels(models);

export default sequelize;
