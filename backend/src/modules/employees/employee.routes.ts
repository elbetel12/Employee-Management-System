import { Router } from 'express';
import * as employeeController from './employee.controller';
import { authenticate, authorize, scopeDepartment } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  employeeQuerySchema,
} from './employee.schema';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  authorize('admin', 'manager'),
  scopeDepartment,
  validate(employeeQuerySchema, 'query'),
  employeeController.list,
);

router.get('/:id', authorize('admin', 'manager'), employeeController.getOne);

router.post(
  '/',
  authorize('admin'),
  validate(createEmployeeSchema),
  employeeController.create,
);

router.patch(
  '/:id',
  authorize('admin', 'manager'),
  validate(updateEmployeeSchema),
  employeeController.update,
);

router.delete('/:id', authorize('admin'), employeeController.remove);

export default router;
