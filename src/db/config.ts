import { Sequelize } from "sequelize-typescript";
import { Employee } from "../models/employee";
import { User } from "../models/user";

const connection = new Sequelize('Ams', 'postgres', 'root@123', {
    host: 'localhost',
    dialect: 'postgres',
    modelPaths: [__dirname + '/models']
    // models:[User]
  });

export default connection;