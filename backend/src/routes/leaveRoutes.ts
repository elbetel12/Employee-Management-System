import express from 'express';
import {
  getLeaves,
  getLeaveById,
  getLeavesByEmployee,
  createLeave,
  updateLeave,
  updateLeaveStatus,
  deleteLeave,
} from '../controllers/leaveController';
import { protect, admin, manager } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(protect, manager, getLeaves)
  .post(protect, createLeave);

router.route('/employee/:id')
  .get(protect, getLeavesByEmployee);

router.route('/:id')
  .get(protect, getLeaveById)
  .put(protect, updateLeave)
  .delete(protect, deleteLeave);

router.route('/:id/status')
  .put(protect, manager, updateLeaveStatus);

export default router; 