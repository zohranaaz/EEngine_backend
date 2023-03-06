import { Table, Column, Model, DataType, CreatedAt, UpdatedAt} from "sequelize-typescript";

@Table({
    timestamps:false,
    tableName:"employee"
})

export class Employee extends Model{
    @Column({
      type:DataType.STRING,
      allowNull: false
    })
    first_name!:string;

    @Column({
       type:DataType.STRING,
       allowNull:false

    })

    last_name!:string;

    @Column({
        type:DataType.STRING,
        allowNull:false
 
     })
 
     phone!:string;


    @Column({
      type:DataType.STRING,
      allowNull:false

   })

   designation!:string;

   @Column({
    type:DataType.STRING,
    allowNull:false

 })

  department!:string;

 @Column({
    type:DataType.STRING,
    allowNull:false

 })

 role_id!:string;

 @Column({
    type:DataType.STRING,
    allowNull:false

 })

 status!:string;


 @Column({
    type:DataType.STRING,
    allowNull:false

 })

 parent_id!:string;


 @Column({
    type:DataType.STRING,
    allowNull:false

 })

 address_id!:string;

 @Column({
    type:DataType.STRING,
    allowNull:false

 })

 user_id!:string;

}