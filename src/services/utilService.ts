const jwt_decode = require('jwt-decode');
const fs = require('fs').promises;
import config from "../config";
const request = require('request');

export const getTokenData = async(req) => {
    if (req.headers.authorization) {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];
        const tokenData = jwt_decode(token);
        return { 'success': true, 'data': tokenData };
    } else {
        return { 'success': false, 'message': 'Please provide a valid input.' };
    }
}

//convert the size of attachement to KB
export const convertToKb = async(data)=>{
    let fileName = data.originalname;
    let fileSize = await fs.stat(config.basePath + fileName);
    let sizeToNum = Number(fileSize.size);
    let byteToKb = (sizeToNum / 1000);
    return Math.floor(byteToKb);

}

export const saveEmailDetails = async(emailObject) => {
    return new Promise((resolve, reject)=>{
        request.post({url:'http://localhost:4080/user/save_email_details', form: emailObject}, function(error,httpResponse){ 
        if(error){
        reject(error);
        }else{
        resolve(httpResponse);
        }
      }
    );  
    });
}

export const updateQuotaDetails = async(quotaObject)=>{
    const obj = quotaObject;
    return new Promise((resolve, reject)=>{
        request.post({url:'http://localhost:4080/user/update_quota', form: obj}, function(error,httpResponse){ 
        if(error){
        reject(error);
        }else{
        resolve(httpResponse);
        }
      }
    );  
    });   
}

export const findOne = async(user_id)=>{
    return new Promise((resolve, reject)=>{
        request.get({url:'http://localhost:4080/user/find_user/'+user_id}, function(error,httpResponse){ 
        if(error){
        reject(error);
        }else{
        resolve(httpResponse.body);
        }
      }
    );  
    });  

}

export const deleteUser = async(user_id)=>{
    return new Promise((resolve, reject)=>{
        request.delete({url:'http://localhost:4080/user/delete_sender/'+user_id}, function(error,httpResponse){ 
        if(error){
        reject(error);
        }else{
        resolve(httpResponse.body);
        }
      }
    );  
    });  
}
