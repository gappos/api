import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import dotenv from "dotenv";

import { Book } from "../models";

dotenv.config();
const uri: string = process.env.DB_CONNECTION_STRING as string;
const options: SequelizeOptions = {
  logging: true,
  dialect: "postgres",
};

if (!uri) throw new Error("Connection to the DB hasn't been set");

const sequelize = new Sequelize(uri, options);

const models = [Book];
sequelize.addModels(models);

export default sequelize;
