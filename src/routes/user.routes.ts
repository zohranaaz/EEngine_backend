import {Router} from "express";
const users = require("../controllers/userController");

const router = Router();

router.post("/", users.createUser);
router.get("/login", users.login)


export default router; 