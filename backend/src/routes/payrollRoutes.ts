import express from 'express';
import {
  getPayrolls,
  getPayrollById,
  getPayrollsByEmployee,
  getPayrollsByMonth,
  createPayroll,
  updatePayroll,
  deletePayroll,
  generatePayrolls,
} from '../controllers/payrollController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(protect, admin, getPayrolls)
  .post(protect, admin, createPayroll);

router.route('/generate')
  .post(protect, admin, generatePayrolls);

router.route('/monthly')
  .get(protect, admin, getPayrollsByMonth);

router.route('/employee/:id')
  .get(protect, getPayrollsByEmployee);

router.route('/:id')
  .get(protect, getPayrollById)
  .put(protect, admin, updatePayroll)
  .delete(protect, admin, deletePayroll);

export default router; 