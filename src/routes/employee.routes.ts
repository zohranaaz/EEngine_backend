import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
const employee = require("../controllers/employeeController");
const router = Router();

router.post("/punchIn", authMiddleware, (req, res, next) => employee.punchIn(req, res, next));
router.get("/", authMiddleware, (req, res, next) => employee.getAttendance(req, res, next));  

export default router; 
