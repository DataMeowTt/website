import express from "express";
import { protect, restrictToAdmin } from "../middleware/authMiddleware.js";
import { getAllUsers, deleteUserController } from "../controllers/userManageController.js";

const router = express.Router();

// Endpoint: Lấy tất cả người dùng
router.use(protect)
router.use(restrictToAdmin)

router.get("/get-all-users", getAllUsers);
router.delete('/delete-user',deleteUserController);

export default router;