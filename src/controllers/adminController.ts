import { RequestHandler } from "express";
import { User } from "../models/user";
import { getTokenData, updateQuotaDetails, findOne, deleteUser } from "../services/utilService"
import { passwordSendMail } from "../services/smtpService";
const Validator = require('validatorjs');
import validator from 'email-validator';

// create sender 
export const createSender: RequestHandler = async (req, res) => {

  let data = {
    email: req.body.email,
    name: req.body.name,
    quota: req.body.quota
  };

  let rules = {
    email: 'required|string|email',
    name: 'required|string',
    quota: 'required'
  };

  let validation = new Validator(data, rules);
  if (validation.fails()) {
    res.status(412)
      .send({
        success: false,
        message: 'Validation failed',
        data: validation.errors.all()
      });
    return;
  }

    const userData = await User.findOne({ where: { email: req.body.email } });
    if (userData) {
      res.status(409).send({ message: "User already exist" })
    }
    else {
      const date = new Date();
      const user = {
        email: req.body.email,
        name: req.body.name,
        password: "",
        role_id: 2,
        created_at: date,
        is_deleted: 0
      };

      const userData = await User.create(user);
      const emailObject = {
        user_id: userData.id,
        total_quota: req.body.quota,
        total_mail_sent: 0,
        created_date: date,
        is_delete: 0
      };

      if (userData) {
        await passwordSendMail(userData);
        await updateQuotaDetails(emailObject).then(() => {
          console.log('quota inserted successfully');
        }).catch((error) => {
          console.log('error: ', error);
        });

        res.status(201).send({ message: "Sender created successfully" });
      } else {
        res.status(400).send({ "error": "Unable to create Sender" });
      }
    }
}

//update quota of sender
export const updateQuota: RequestHandler = async (req, res) => {

  const user_id = req.params.userId;
  if (!user_id) {
    res.status(400).send({
      message: "User Id is required in query string."
    });
    return;
  }
  if (!req.body.quota) {
    res.status(400).send({
      message: "Quota cannot be empty."
    });
    return;
  }
  
  const loginUser = await getTokenData(req);
  if (loginUser.data.role_id === 1) {
    const userData = await User.findOne({ where: { id: user_id } });

    if (userData) {
      const emailObject = {
        user_id: userData.id,
        total_quota: req.body.quota
      };
      await updateQuotaDetails(emailObject).then(() => {
        res.status(201).send({ message: "Sender quota updated successfully" });
      }).catch((error) => {
        res.status(500).send({ "error": error });
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } else {
    res.status(403).send({ message: "Requested user is forbidden." });
  }

}

// delete sender
export const deleteSender: RequestHandler = async (req, res) => {

  const user_id = req.params.userId;  
  if (!user_id) {
    res.status(400).send({
      message: "User Id is required in query string"
    });
    return;
  }
  
  const loginUser = await getTokenData(req);
  if (loginUser.data.role_id === 1) {
    const user = await User.findOne({ where: { id: user_id, is_deleted:0 } });
    if (user) {
      const response = await User.update({ is_deleted: 1 }, { where: { id: user.id } });
      if (response) {
        const resp:any = await deleteUser(user.id);    
        if(resp){
          res.status(201).send({ message: "Sender Deleted successfully" });
        }        
      } else {
        res.status(400).send({ message: "Internal server error" });
      }
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } else {
    res.status(403).send({ message: "Requested user is forbidden." });
  }
}

// fetch details of sender 
export const fetchSenderDetails: RequestHandler = async (req, res) => {

  if (!req.body.email_id) {
    res.status(400).send({
      message: "Email is required."
    });
    return;
  }
  
  const loginUser = await getTokenData(req);
  const email_id = req.body.email_id;
  if (loginUser.data.role_id === 1) {

    const user = await User.findOne({ where: { email: email_id, is_deleted: 0 } });
    if (user) {
      const response:any = await findOne(user.id);
      const userObject = JSON.parse(response);
      delete userObject.user_id;
      res.status(200).jsonp(userObject);
      } else {
      res.status(400).jsonp("User not found!");
    }
  } else {
    res.status(403).send({ message: "Requested user is forbidden." });
  }
}