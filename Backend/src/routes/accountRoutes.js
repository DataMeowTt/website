import express from "express";
import { updateAdminProfile } from "../controllers/accountController.js";
import { protect, restrictToAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect)
router.use(restrictToAdmin)
router.put("/profile", updateAdminProfile);

export default router;
