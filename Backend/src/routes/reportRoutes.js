import express from "express";
import { getRevenueAndCost, getMonthlyReport } from "../controllers/reportController.js";
import { protect, restrictToAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.use("/",  protect, restrictToAdmin)

router.get("/summary", getRevenueAndCost);
router.get("/monthly", getMonthlyReport); 

export default router;
