import express from "express";
import * as controller from "../controllers/sellhistoryController.js";
import { protect, restrictToClient } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use("/", protect)
router.use("/", restrictToClient)

// Tạo hóa đơn mới
router.post("/", controller.create);

export default router;