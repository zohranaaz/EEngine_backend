import { Router } from "express"; 
import { authMiddleware } from "../middleware/authMiddleware"
const users = require("../controllers/userController");
const router = Router();

router.post("/login", users.login);
router.post("/register", users.register);
router.post("/create_password",authMiddleware,(req, res, next) => users.createPassword(req, res, next));
router.post("/change_password",authMiddleware, (req, res, next) => users.changePassword(req, res, next));
router.post("/send_mail",authMiddleware, (req, res, next) => users.sendMail(req, res, next));

export default router; 