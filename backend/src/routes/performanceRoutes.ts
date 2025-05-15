import express from 'express';
import {
  getPerformances,
  getPerformanceById,
  getPerformancesByEmployee,
  createPerformance,
  updatePerformance,
  deletePerformance,
} from '../controllers/performanceController';
import { protect, admin, manager } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(protect, manager, getPerformances)
  .post(protect, manager, createPerformance);

router.route('/employee/:id')
  .get(protect, getPerformancesByEmployee);

router.route('/:id')
  .get(protect, getPerformanceById)
  .put(protect, manager, updatePerformance)
  .delete(protect, admin, deletePerformance);

export default router; 