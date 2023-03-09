import { Table, Column, Model, DataType, CreatedAt, UpdatedAt} from "sequelize-typescript";

@Table({
   timestamps:false,
   tableName:"attendance"
})

export class Attendance extends Model{

    @Column({
     type:DataType.TIME,
     allowNull: false
    })
    in_time!: string;
     
    @Column({
        type:DataType.TIME,
        allowNull: false
       })
    out_time!: string;
        
    @Column({
        type:DataType.DATE,
        allowNull: false
       })
    date!: Date;
    
    @Column({
        type:DataType.STRING,
        allowNull: false
       })

    status!: string;

       @Column({
        type:DataType.STRING,
        allowNull: false
       })

     emp_id!: string;

}