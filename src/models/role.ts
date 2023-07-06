import { Table, Column, Model, DataType, CreatedAt, UpdatedAt} from "sequelize-typescript";

@Table({
   timestamps:false,
   tableName:"role"
})

export class Role extends Model{
     
    @Column({
        type:DataType.STRING,
        allowNull: false
       })
    name!: string;
        
    @Column({
        type:DataType.DATE,
        allowNull: false
       })
    created_at!: Date;
        
    @Column({
        type:DataType.BOOLEAN,
        allowNull: false
       })
    is_deleted!: string;

}