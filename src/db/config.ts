import { Sequelize } from "sequelize-typescript";
import { User } from "../models/user";

const connection = new Sequelize('Ams', 'postgres', 'root@123', {
    host: 'localhost',
    dialect: 'postgres',
    models:[User]
  });

export default connection;