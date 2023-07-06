import { RequestHandler } from "express";
import { User } from "../models/user";
import { sendExhaustsMail, sendmail, sendStatistics } from "../services/smtpService";
import { getTokenData, convertToKb, saveEmailDetails, findOne } from "../services/utilService";
import config from "../config";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const Validator = require('validatorjs');

// register for admin 
export const register: RequestHandler = async (req, res) => {

  let data = {
    email: req.body.email,
    name: req.body.name,
    password: req.body.password
  };
  
  let rules = {
    email: 'required|string|email',
    name: 'required|string',
    password: 'required|string|min:6'
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
      password: req.body.password,
      quota: 0,
      role_id: 1,
      total_email_sent: 0,
      total_sent_email_size: 0,
      token: "",
      created_at: date,
      is_deleted: 0
    };

    const salt = await bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(req.body.password, salt);
    user.password = hashPassword;
    try {
      const userData = await User.create(user);
      if (userData) {
        res.status(201).send({ message: "Admin created successfully" });
      }
    }
    catch (error) {
      res.status(400).send({ error: error });
    }
  }

}

// login for (admin/sender) both
export const login: RequestHandler = async (req, res) => {

  let data = {
    email: req.body.email,
    password: req.body.password
  };
  
  let rules = {
    email: 'required|string|email',
    password: 'required|string'
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
 
  const jwtToken = config.jwtsecretkey;
  const user = await User.findOne({ where: { email: req.body.email, is_deleted: 0 } });
  if (user === null) {
    res.status(404).send({ message: "User not found!" })
  } else {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      const userData = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "password": user.password,
        "role_id": user.role_id
      }

      const token = jwt.sign(userData, jwtToken, { expiresIn: 1800 });
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

//change password for admin/sender
export const changePassword: RequestHandler = async (req, res) => {

  let data = {
    user_id: req.body.user_id,
    oldpassword: req.body.oldpassword,
    newpassword: req.body.newpassword
  };
  
  let rules = {
    user_id: 'required',
    oldpassword: 'required|string',
    newpassword: 'required|string|min:6'  
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
 
  const loginUser = await getTokenData(req);
  const userId = req.body.user_id;

  if (loginUser.success && loginUser.data.id === userId) {
    const userData = await User.findOne({ where: { id: userId } });
    let oldpassword = req.body.oldpassword;
    let newpassword = req.body.newpassword;

    if (userData) {
      const response: any = await verifyOldpassword(oldpassword, userData.password);
      if (response) {
        const salt = await bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(newpassword, salt);
        await User.update({ password: hashPassword }, { where: { id: userData.id } });
        res.status(201).send({ message: "User password updated successfully" })
      } else {
        res.status(401).send({ message: "Old password do not match" })
      }
    } else {
      res.status(404).send({ message: "User not found!" });
    }

  } else {
    res.status(400).jsonp({ error: `Bad request.` });
  }
}

export const verifyOldpassword = async (oldPassword, storedPassword) => {
  try {
    if (bcrypt.compareSync(oldPassword, storedPassword)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log('the error', error);
  }
}


//create password for sender
export const createPassword: RequestHandler = async (req, res) => {

  let data = {
    email_id: req.body.email_id,
    password: req.body.password
  };
  
  let rules = {
    email_id: 'required|string|email',
    password: 'required|string|min:6'
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

  const user = await User.findOne({ where: { email: req.body.email_id.trim() } });
  if (user) {
    if (user.password === "") {
      const salt = await bcrypt.genSaltSync(10);
      const hashPassword = await bcrypt.hashSync(req.body.password, salt);
      const response = await User.update({ password: hashPassword }, { where: { id: user.id } });
      if (response) {
        res.status(200).send({ mesage: "Password created successfully" });
      } else {
        res.status(400).send({ message: "Internal server error" });
      }
    } else {
      res.status(409).send({ mesage: "You cannot create new password again." });
    }
  }
  else {
    res.status(404).send({ mesage: "User not found" });
  }
};

//sender send mail 
export const sendMail = async (req, res) => {

  let data = {
    receiver_email: req.body.receiver_email,
    email_subject: req.body.email_subject,
    email_body: req.body.email_body
  };
  
  let rules = {
    receiver_email: 'required|string',
    email_subject: 'required|string',
    email_body: 'required|string'
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

  const loginUser = await getTokenData(req);
  if (loginUser.data.role_id === 2) {

    const currentDate = new Date();
    let fileName = "";
    let fileTokb = 0;

    //if there is attachment with email then convert the file size to KB
    if (req.files[0]) {
      let file = req.files[0];
      fileName = req.files[0].originalname;
      fileTokb = await convertToKb(file);
    }

    const response: any = await findOne(loginUser.data.id);
    const userObject = JSON.parse(response);
    const totalMailSent = userObject.total_mail_sent as number;
    const quota = userObject.total_quota as number;
    const remainingQuota = quota - totalMailSent;

    const emailArr = req.body.receiver_email.split(",");
    const totalCount = emailArr.length;

    if (remainingQuota > 0) {
      if (remainingQuota >= totalCount) {

        const info = await sendmail(req.body, fileName);
        if (info) {
          console.log('The Mail is sent', info.messageId);
          const emailObject = {
            user_id: userObject.user_id,
            total_quota: quota,
            total_attachment_size: fileTokb,
            sent_to: emailArr,
            created_date: currentDate,
            is_deleted: false
          };

          await saveEmailDetails(emailObject).then(async(resp:any) => {
            const userObject = JSON.parse(resp.body);
            const tq = userObject.total_quota as number;
            const tms = userObject.total_mail_sent as number;
            const rquota = tq - tms;

            //for sending notification of email statistics if the quota is less than 5
            if (rquota <= 5) {
              await sendStatistics(userObject, loginUser);
            }
            res.status(200).send({ message: "Mail sent successfully." });
          }).catch((error) => {
            res.status(500).json(error);
          });
        } else {
          res.status(400).send({ message: "Internal Server error." });
        }
      } else {
        res.status(400).send({ message: "You have only "+remainingQuota+" remaining quota, you cannot send mail to "+ totalCount + " receiver"});
      }
    } else {
      await sendExhaustsMail(loginUser);
      res.status(400).send({ message: "Your mail quota has been expired. Please contact admin" });
    }
  } else {
    res.status(403).send({ message: "Requested user is forbidden." });
  }
} 