import express from 'express';
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(protect, getDepartments)
  .post(protect, admin, createDepartment);

router.route('/:id')
  .get(protect, getDepartmentById)
  .put(protect, admin, updateDepartment)
  .delete(protect, admin, deleteDepartment);

export default router; 