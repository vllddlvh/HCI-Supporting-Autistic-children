import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import verifyToken from '../middleware/authMiddleware.js'; // Nhớ import đúng cách (default/named)

const router = express.Router();

router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, updateUserProfile);

export default router;