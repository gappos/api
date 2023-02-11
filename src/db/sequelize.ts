import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import dotenv from 'dotenv';

import { Book, Location, Person } from '../models';
import logger from './logger';

dotenv.config();
const uri: string = process.env.DB_CONNECTION_STRING as string;
const options: SequelizeOptions = {
  logging: logger,
  dialect: 'postgres',
};

if (!uri) throw new Error("Connection to the DB hasn't been set");

const sequelize = new Sequelize(uri, options);

const models = [Book, Location, Person];
sequelize.addModels(models);

export default sequelize;
