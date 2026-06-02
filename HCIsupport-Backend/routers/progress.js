import express from 'express';
import { getProgressMap, logActivity, resetProgress } from '../controllers/progressController.js';
import verifyToken from '../middleware/authMiddleware.js'; // Import middleware

const router = express.Router();

router.get('/', verifyToken, getProgressMap);
router.post('/log', verifyToken, logActivity);
router.delete('/reset', verifyToken, resetProgress);

export default router;