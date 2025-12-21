import express from "express";
import { getHistory, confirmPayment } from "../controllers/billManageController.js";

const router = express.Router();


router.get("/history", getHistory);

router.post("/confirm-payment", confirmPayment);

export default router;