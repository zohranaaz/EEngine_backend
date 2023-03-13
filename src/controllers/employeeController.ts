import { RequestHandler } from "express";
import { User } from "../models/user";
import { Attendance } from "../models/attendance";
import dotenv from 'dotenv';
import { Employee } from "../models/employee";
dotenv.config();

export const punchInOut: RequestHandler = async (req, res) => {

    const emp_id = req.body.emp_id;
    const userData = await User.findOne({ where: { user_name: req.body.emp_id } });
    let punch_status={};
    let attendance = {};
    let status = {};

    let d=new Date();
    let current_date = d.toLocaleString();       // -> Sat Feb 28 23:45:26 2004
    let current_time = d.toLocaleTimeString();   // 11:18:48 AM
 
    if (userData) {
        const checkStatus = await Attendance.findOne({ where: { emp_id: req.body.emp_id }, 
        order: [ [ 'id', 'DESC' ]]
        });
        
        if(checkStatus){
            punch_status = checkStatus.status;
        }else{
            punch_status = "punchOut";
        }    

        if (punch_status == "punchIn") {
             attendance = {
                in_time: "00:00:00",
                out_time: current_time,
                date: current_date,
                status: "punchOut",
                emp_id: emp_id
            }
            status = "Punch Out done successfully";
        } else {

              attendance = {
                in_time: current_time,
                out_time: "00:00:00",
                date: current_date,
                status: "punchIn",
                emp_id: emp_id
            }
            status = "Punch In done successfully";
        }

        const resData = await Attendance.create(attendance);
        if (resData) {
            res.status(201).send({ message: status });
        }
        else {
            res.status(500).send();
        }
    }
    else {
        res.status(404).send("user not found");
    }
}

export const getAttendance: RequestHandler = async (req, res) => {

    const attendance = await Attendance.findAll({ where: { emp_id: req.body.emp_id },
    include:[{
        model:Employee,
        where: {id: req.body.emp_id}
    }]
    });

    console.log("attendance details: ",attendance);

    return
    if (attendance === null) {
        res.status(500).send({ message: "some error occured" })
      } else {
        res.status(200).send(attendance);
      }
}