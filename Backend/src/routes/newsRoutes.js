import express from "express";
import {
  createNews,
  getNewsById,
  updateNews,
  deleteNews,
  getNewsController
} from "../controllers/newsController.js";
import { protect, restrictToAdmin } from "../middleware/authMiddleware.js";
import csrfConfig from '../middleware/csrfConfig.js';

const router = express.Router();

router.use("/", protect)          // yêu cầu đăng nhập
router.use("/", restrictToAdmin)  // giới hạn quyền truy cập -- admin

router.get("/", getNewsController);

// Tạo tin tức mới
router.post("/", createNews);

// Lấy chi tiết tin tức theo ID
router.get("/:id", getNewsById);

// Cập nhật tin tức theo ID
router.put("/:id", updateNews);

// Xoá tin tức theo ID
router.delete("/:id", deleteNews);



export default router;
