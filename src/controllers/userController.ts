import { RequestHandler } from "express";
import { User } from "../models/user";
import { Employee } from "../models/employee";
import config from "../config";
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SecretKey = config.jwtsecretkey;

export const createUser: RequestHandler = async (req, res) => {

  if (!req.body.email) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const userData = await User.findOne({ where: { email: req.body.email } });
  if (userData) {
    res.status(409).send({ message: "User already exist" })
  }
  else {
    const user = {
      user_name: req.body.user_name ? req.body.user_name : 0,
      email: req.body.email,
      password: "root123",
      gender: req.body.gender
    };

    const salt = await bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(user.password, salt);
    user.password = hashPassword;
    const userData = await User.create(user)
    const result = await addEmployee(req, userData.id)
    const empId = "AMT" + result.id;

    if (result) {
      await User.update({ user_name: empId }, { where: { id: userData.id } });
      res.status(201).send({ message: "User created successfully" })
    }
  }

}

async function addEmployee(req, user_id) {
  const employee = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    phone: req.body.phone,
    designation: req.body.designation,
    department: req.body.department,
    role_id: req.body.role_id,
    status: req.body.status,
    parent_id: 101,
    address_id: "",
    user_id: user_id
  };

  const empData = await Employee.create(employee)
  return empData;
}

export const login: RequestHandler = async (req, res) => {

  const user_name = req.body.emp_id;
  const password = req.body.password;

  const user = await User.findOne({ where: { user_name: user_name } });
  if (user === null) {
    res.status(404).send({ message: "User not found!" })
  } else {
    if (bcrypt.compareSync(password, user.password)) {
      const userData = {
        "email": user.email,
        "password": user.password,
        "gender": user.gender
      }

      const token = jwt.sign(userData, SecretKey, { expiresIn: 1800 });
      const response = {
        "token": token,
        "expiresIn": 1800

      }
      res.status(200).send(response);
    } else {
      res.status(401).send({ message: "Unauthorized" })
    }
  }
};

export const getUser: RequestHandler = async (req, res) => {
  const user = await User.findAll({});
  if (user === null) {
    res.status(500).send({ message: "some error occured" })
  } else {
    res.status(200).send(user);
  }
};

