import express from "express";
import { getNewsController } from "../controllers/newsController.js";
import { protect, restrictToClient } from "../middleware/authMiddleware.js";

const router = express.Router();

// Định nghĩa route GET để lấy tất cả tin tức, public hoàn toàn
router.get("/", getNewsController);

export default router;