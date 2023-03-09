import { RequestHandler } from "express";
import { User } from "../models/user";
import { Attendance } from "../models/attendance";
import dotenv from 'dotenv';
dotenv.config();

export const punchIn: RequestHandler = async ( req, res) => {

    const emp_id = req.body.emp_id;      
    const userData = await User.findOne({ where: { user_name: req.body.emp_id } });
    
    if(userData){
        const attendance = {
            in_time : req.body.in_time,
            out_time: "00:00:00",
            date:req.body.date,
            status: "active",
            emp_id: emp_id
        } 

        const resData = await Attendance.create(attendance);
        if(resData){
            console.log("Punch in done successfully");
            res.status(201).send({ message: "Punch in done successfully" })
        }
        else{
            res.status(500).send();
        }
    }
    else{
         res.status(404).send();
    }
}

export const getAttendance: RequestHandler = async ( req, res) =>{

 const attendance = await Attendance.findAll({where: { emp_id: req.body.emp_id }});
 console.log("attendance details : ",attendance);
  
}
