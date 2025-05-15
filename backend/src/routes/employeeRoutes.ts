import express from 'express';
import {
  getEmployees,
  getEmployeeById,
  getEmployeesByDepartment,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController';
import { protect, admin, manager } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(protect, getEmployees)
  .post(protect, admin, createEmployee);

router.route('/department/:id')
  .get(protect, getEmployeesByDepartment);

router.route('/:id')
  .get(protect, getEmployeeById)
  .put(protect, admin, updateEmployee)
  .delete(protect, admin, deleteEmployee);

export default router; 