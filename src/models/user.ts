import { Table, Column, Model, DataType, CreatedAt, UpdatedAt} from "sequelize-typescript";

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
      allowNull: false
    })
    name!:string;

    @Column({
       type:DataType.STRING,
       allowNull:true
    })  

    password!:string;

    @Column({
      type:DataType.INTEGER,
      allowNull:false

   })

     role_id!:string;

   @Column({
    type:DataType.DATE,
    allowNull:false

   })

   created_at!:string;

   @Column({
    type:DataType.BOOLEAN,
    allowNull:false

   })

   is_deleted!:string;

}