import { RequestHandler } from "express";
import { User } from "../models/user";
import { Attendance } from "../models/attendance";
import dotenv from 'dotenv';
dotenv.config();

export const punchInOut: RequestHandler = async (req, res) => {

    const emp_id = req.body.emp_id;
    const userData = await User.findOne({ where: { user_name: req.body.emp_id } });
    let punch_status={};
    let attendance = {};
    let status_message = {};
    let resData;

    let date=new Date();
    let current_date = date.toLocaleString();       // -> Sat Feb 28 23:45:26 2004
    let current_time = date.toLocaleTimeString();   // 11:18:48 AM
 
    if (userData) {
        const checkStatus = await Attendance.findOne({ where: { emp_id: req.body.emp_id } });
        punch_status = checkStatus ? checkStatus.status : "punchOut";

        if (punch_status == "punchIn") {
             attendance = {
                in_time: checkStatus ? checkStatus.in_time : "00:00:00",
                out_time: current_time,
                date: current_date,
                status: "punchOut",
                emp_id: emp_id
            }
            status_message = "Punch Out done successfully";
        } else {

              attendance = {
                in_time: current_time,
                out_time: checkStatus ? checkStatus.out_time : "00:00:00",
                date: current_date,
                status: "punchIn",
                emp_id: emp_id
            }
            status_message = "Punch In done successfully";
        }

        if(checkStatus){
            resData =  await Attendance.update(attendance, { where: { id: checkStatus.id } });
        }
        else{
             resData = await Attendance.create(attendance);
        }

        if (resData) {
            res.status(201).send({ message: status_message, status: resData.status });
        }
        else {
            res.status(500).send();
        }
    }
    else {
        res.status(404).send("user not found");
    }
}

export const getAttendanceById: RequestHandler = async (req, res) => {
    
    if(!req.body.emp_id){
      res.status(400).send({
        message: "Content cannot be empty!"
      });
    }
    const attendance = await Attendance.findAll({ where: { emp_id: req.body.emp_id } });
    if (attendance.length === 0) {
        res.status(404).send({ message: "No attendance history found" })
      } else {
        res.status(200).send(attendance);
      }
}

export const getEmployeeAttendance: RequestHandler = async (req, res) => {
    const attendance = await Attendance.findAll({});    
}