import { Router } from "express"; 
import { authMiddleware } from "../middleware/authMiddleware"
const admin = require("../controllers/adminController");
const router = Router();

router.post("/create_sender",authMiddleware, (req, res, next) => admin.createSender(req, res, next));
router.get("/get_statistics/",authMiddleware, (req, res, next) => admin.fetchSenderDetails(req, res, next));
router.delete("/delete_sender/:userId",authMiddleware,(req, res, next)=> admin.deleteSender(req, res, next));
router.put("/update_quota/:userId",authMiddleware,(req, res, next)=> admin.updateQuota(req, res, next));

export default router;