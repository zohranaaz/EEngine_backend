import { Router } from "express"; 
import  authMiddleware from "../middleware/authMiddleware"
const users = require("../controllers/userController");
const router = Router();

router.post("/", users.createUser);
router.get("/login", users.login);
router.get("/getUser",authMiddleware, (req, res, next) => users.getUser(req, res, next));

export default router; 
