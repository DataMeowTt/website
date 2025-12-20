import express from "express";
import { getCenters, getCenterDetail, getPricing } from "../controllers/centersController.js";

const router = express.Router();

// Lấy danh sách trung tâm (có hỗ trợ search/filter qua query)
router.get("/", getCenters);

// Lấy chi tiết thông tin một trung tâm cụ thể
router.get("/:id", getCenterDetail);

// Lấy bảng giá phục vụ cho Modal Pricing ở Frontend
router.get("/:id/pricing", getPricing);

export default router;