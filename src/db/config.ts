import { Sequelize } from "sequelize-typescript";
import { User } from "../models/user";
import { Employee } from "../models/employee"; 
import { Attendance } from "../models/attendance";

export class Database{
    private sequelize:Sequelize;
    constructor(){
        this.sequelize = new Sequelize('Ams', 'postgres', 'root@123', {
            host: 'localhost',
            dialect: 'postgres'
          });
    }

    public async addTables(){
        //  this.sequelize.addModels([__dirname + '/models']);
        this.sequelize.addModels([User]);
        this.sequelize.addModels([Employee]);
        this.sequelize.addModels([Attendance]); 
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