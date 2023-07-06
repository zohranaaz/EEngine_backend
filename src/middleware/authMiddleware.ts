// const jwt = require('jsonwebtoken');
import { Request, Response, NextFunction } from "express"
import * as jwt from 'jsonwebtoken';
import config from "../config";
const JWT_KEY = config.jwtsecretkey; 

export const authMiddleware = async(req: Request, res: Response, next: NextFunction)=> {
    const header = req.headers.authorization;
    if (header && header !== "null") {
        const token = header.split(" ")[1];
        jwt.verify(token, JWT_KEY, (err: any) => {
            if (err) {
                return res
                    .status(400)
                    .send({ success: false, message: "User token has expired" })
            } else {
                next();
            }
        })
    } else {
        res.status(400).json({ success: false, message: "Unauthorized" })
    }
}

