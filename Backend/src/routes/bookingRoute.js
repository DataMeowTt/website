import express from "express";
import { getMapping, togglePending } from "../controllers/bookingController.js";

const router = express.Router();

// Lấy dữ liệu lưới sân để hiển thị (Trống/Đỏ/Vàng)
router.get("/pending/mapping", getMapping);

// Giữ chỗ hoặc bỏ chọn khung giờ
router.post("/pending/toggle", togglePending);

export default router;