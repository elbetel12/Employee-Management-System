import express from 'express';
import {
  getAttendances,
  getAttendanceByEmployee,
  getAttendanceByDateRange,
  checkIn,
  checkOut,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from '../controllers/attendanceController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(protect, admin, getAttendances)
  .post(protect, admin, createAttendance);

router.route('/daterange')
  .get(protect, getAttendanceByDateRange);

router.route('/check-in')
  .post(protect, checkIn);

router.route('/check-out')
  .post(protect, checkOut);

router.route('/employee/:id')
  .get(protect, getAttendanceByEmployee);

router.route('/:id')
  .put(protect, admin, updateAttendance)
  .delete(protect, admin, deleteAttendance);

export default router; 