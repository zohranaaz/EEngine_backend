import { Table, Column, Model, DataType} from "sequelize-typescript";

@Table({
    timestamps:false,
    tableName:"user"
})

export class User extends Model{
    @Column({
      type:DataType.STRING,
      allowNull: false
    })
    email!:string;

    @Column({
       type:DataType.STRING,
       allowNull:false

    })

    password!:string;

    @Column({
        type:DataType.STRING,
        allowNull:false
 
     })
 
     gender!:string;
}