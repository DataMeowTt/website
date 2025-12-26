import express from 'express';
import { getRatingsByCenterController, deleteRatingController, getCommentsForCenter } from '../controllers/ratingController.js';
import {protect, restrictToAdmin } from '../middleware/authMiddleware.js';
import csrfConfig from '../middleware/csrfConfig.js';

const router = express.Router();
const csrfProtection = csrfConfig;

router.get("/get-ratings-for-center",protect, restrictToAdmin, getCommentsForCenter);
router.get('/center/:centerId', protect, restrictToAdmin, getRatingsByCenterController);
router.delete('/:id', protect, restrictToAdmin, csrfProtection, deleteRatingController);

export default router;
