import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const {
  DB_HOST = '127.0.0.1',
  DB_PORT = '5432',
  DB_NAME = 'rental_service',
  DB_USER = 'postgres',
  DB_PASSWORD = 'postgres',
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: 'postgres',
  logging: false,
});

export default sequelize;
