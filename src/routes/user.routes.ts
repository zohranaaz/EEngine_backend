import { Router } from "express";
const users = require("../controllers/userController");
const router = Router();

router.post("/", users.createUser);
router.get("/login", users.login);  
router.get("/getUser",users.getUser);

export default router; 
