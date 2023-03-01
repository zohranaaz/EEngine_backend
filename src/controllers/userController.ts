import { RequestHandler } from "express";
import { User } from "../models/user";
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

export const createUser: RequestHandler = async ( req, res) => {
       
    if (!req.body.email) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
        return;
      }
      
      const userData = await User.findOne({ where: { email: req.body.email } });

      if(userData){
        res.status(409).send({ message: "User already exist" })

      }
      else{
        const user = {
          email: req.body.email,
          password: req.body.password,
          gender: req.body.gender
        };

        const salt = await bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(user.password, salt);
        user.password = hashPassword;

        User.create(user)
        .then(data => {
          res.status(201).json("User created successfully");
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the user."
          });
      });
      } 
      
}

export const login: RequestHandler = async (req, res) => {

  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ where: { email: email } });
  if (user === null) {
      res.status(404).send({message: "User not found!"})
  } else {
    if (bcrypt.compareSync(password, user.password)) {
      const userData = {
          "email": user.email,
          "password": user.password,
          "gender": user.gender
      }
      const token = jwt.sign(userData, 'ydwygyegyegcveyvcyegc', { expiresIn: 1800 });

      const response = {
          "token": token,
          "expiresIn": 1800

      }
      res.status(200).send(response);
    } else {
      res.status(401).send({message: "Unauthorized"})
    }
  }
};

