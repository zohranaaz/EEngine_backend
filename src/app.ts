import express from 'express';
import connection from './db/config';
import router from './routes/user.routes';
import {json, urlencoded} from 'body-parser';
const port = 3000;
const app = express();


app.use(urlencoded({extended:true}));
app.use(json());
app.use("/user", router);

app.use((
  err:Error,
    req:express.Request,
    res:express.Response,
    next:express.NextFunction
)=>{
    res.status(500).json({message:err.message});
});

connection.sync().then(()=>{

  console.log("Database synced successfully")

}).catch((err)=>{

   console.log("Error", err);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
