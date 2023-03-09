// const jwt = require('jsonwebtoken');
import { Request, Response, NextFunction } from "express"
import * as jwt from 'jsonwebtoken';
import config from "../config";

const jwt_decode = require('jwt-decode');
const JWT_KEY = config.jwtsecretkey;

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader !== "null") {
        const token = authHeader.split(" ")[1];
        var tokenData = jwt_decode(token);
        let issuer = process.env.ISSUER;
        let audience = process.env.AUDIENCE;
        let tokenIssuer = tokenData.issuer;
        let tokenAudience = tokenData.audience;
        if(issuer == tokenIssuer && audience == tokenAudience){
            console.log(tokenData);
            jwt.verify(token, JWT_KEY, (err: any, user: any) => {
            if (err) {
                console.log("Error", err);
                return res
                .status(400)
                .send({ success: false, message: "Token Expired" })
            }else{
                next();
            }
            
            
            })
        }else{
            res.status(400).json({ success: false, message: "Not Authorized" })
        }
        
      } else {
        res.status(400).json({ success: false, message: "UnAuthorized" })
      }
}

export default authMiddleware;