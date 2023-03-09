import express, {Request, Response} from 'express';
import userRoute from './routes/user.routes';
import employeeRoute from './routes/employee.routes'
import {json, urlencoded} from 'body-parser';
import { Database } from "./db/config";
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT;

export class App{

   private app: express.Application;
   constructor(){
    this.app = express();
    this.app.use(json());
    this.app.use(urlencoded({ extended:true}));
    this.app.use("/user",userRoute);
    this.app.use("/employee",employeeRoute);

    this.app.use((
      err:Error,
        req:express.Request,
        res:express.Response,
        next:express.NextFunction
            )=>{
                res.status(500).json({message:err.message});
            });
  }

    /**
     * listen on port
     */
    public listen(port:string): void {

      this.app.listen(port, () =>{
      console.log(`Listening on port ${port}`);
      })
    }   

}

const app = new App();
app.listen(port);
const db = new Database();
try {
   db.addTables();
   db.connect();
} catch (error) {
  
  console.log("Error",error);
}
