import express from 'express';
import {
  getUserNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '../controllers/notificationController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(protect, getUserNotifications);

router.route('/unread')
  .get(protect, getUnreadNotifications);

router.route('/read-all')
  .put(protect, markAllNotificationsAsRead);

router.route('/:id/read')
  .put(protect, markNotificationAsRead);

router.route('/:id')
  .delete(protect, deleteNotification);

export default router; 