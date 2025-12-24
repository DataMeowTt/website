import express from "express";
import * as controller from "../controllers/sellhistoryController.js";
import { protect, restrictToAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use("/", protect)
router.use("/", restrictToAdmin)

// Tất cả hóa đơn bán hàng
router.get("/", controller.getAll);

// Tạo hóa đơn mới
router.post("/", controller.create);

export default router;