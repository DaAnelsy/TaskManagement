"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Task_1 = require("../models/Task");
const User_1 = require("../models/User");
const sequelize = new sequelize_typescript_1.Sequelize({
    database: process.env.DB_NAME || 'taskdb',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '0292',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    models: [Task_1.Task, User_1.User],
    logging: false
});
exports.default = sequelize;
