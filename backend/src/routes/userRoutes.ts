import express from 'express';
import { authUser, getUserProfile, changePassword, registerUser } from '../controllers/userController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/password').put(protect, changePassword);
router.route('/').post(registerUser);

export default router; 