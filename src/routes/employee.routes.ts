import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
const employee = require("../controllers/employeeController");
const router = Router();

router.post("/punchInOut", authMiddleware, (req, res, next) => employee.punchInOut(req, res, next));
router.get("/", authMiddleware, (req, res, next) => employee.getAttendance(req, res, next));  

export default router; 
