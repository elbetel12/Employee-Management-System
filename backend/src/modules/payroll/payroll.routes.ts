import { Router } from 'express';
import * as ctrl from './payroll.controller';
import { authenticate, authorize, scopeDepartment } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { generatePayrollSchema, updatePayrollSchema, payrollQuerySchema } from './payroll.schema';

const router = Router();
router.use(authenticate);

router.get(
  '/',
  authorize('admin', 'manager'),
  scopeDepartment,
  validate(payrollQuerySchema, 'query'),
  ctrl.list,
);
router.get('/:id', authorize('admin', 'manager'), ctrl.getOne);
router.post('/generate', authorize('admin'), validate(generatePayrollSchema), ctrl.generate);
router.patch('/:id', authorize('admin'), validate(updatePayrollSchema), ctrl.update);

export default router;
