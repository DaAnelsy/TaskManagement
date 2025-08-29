import { Sequelize } from 'sequelize-typescript';
import { Task } from '../models/Task';
import { User } from '../models/User';

const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'taskdb',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '0292',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  dialect: 'postgres',
  models: [Task, User],
  logging: false
});

export default sequelize;