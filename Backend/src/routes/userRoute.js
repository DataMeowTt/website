import express from "express";
import {
  insertRating,
  getDetailedBookingStatsController,
  getChartController,
  getUserInfoController,
  logoutController,
  updateUserController,
  updateUserPasswordController,
  registerUserController,
  loginUserController,
  forgotPasswordByEmailController,
  resetPasswordController,
} from "../controllers/userController.js";
import { protect, restrictToClient } from "../middleware/authMiddleware.js";
import { uploadMiddleware } from "../middleware/uploadMiddleware.js";

import { loginRateLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

// Các route không yêu cầu đăng nhập và không cần CSRF
router.post("/forgot-password-email", forgotPasswordByEmailController);
router.post("/reset-password/:token/:userId", resetPasswordController);

// Các route không yêu cầu đăng nhập 
router.post("/register", registerUserController);
router.post("/login", loginRateLimiter, loginUserController);

// Các route yêu cầu đăng nhập và chỉ dành cho client
router.use(protect)
router.use(restrictToClient)
router.get("/me", getUserInfoController);
router.post("/logout", logoutController);
router.put("/update", uploadMiddleware, updateUserController);
router.put("/change-password", updateUserPasswordController);
router.get("/get-chart", getChartController);
router.get("/detailed-stats", getDetailedBookingStatsController);
router.post("/insert-ratings", insertRating);

export default router;