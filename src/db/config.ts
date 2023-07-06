import { Sequelize } from "sequelize-typescript";
import { User } from "../models/user";
import { Role } from "../models/role";
import config from "../config";

export class Database{
    private sequelize:Sequelize;
    constructor(){
        this.sequelize = new Sequelize(config.database, config.dbuser, config.dbpassword, {
            host: config.host,
            dialect: 'mysql'
          });
    }

    public async addTables(){
        this.sequelize.addModels([User]);
        this.sequelize.addModels([Role]);
    }

    public async connect(){
        try {
            await this.sequelize.authenticate();
            await this.sequelize.sync({
            })
            console.log("Connection has been established");
        } catch (error) {
            console.log("Unable to connect to database");
        }
    }
}