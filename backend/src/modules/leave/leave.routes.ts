import { Router } from 'express';
import * as ctrl from './leave.controller';
import { authenticate, authorize, scopeDepartment } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createLeaveSchema, updateLeaveSchema, leaveQuerySchema } from './leave.schema';

const router = Router();
router.use(authenticate);

router.get(
  '/',
  authorize('admin', 'manager', 'employee'),
  scopeDepartment,
  validate(leaveQuerySchema, 'query'),
  ctrl.list,
);
router.post('/', authorize('admin', 'manager', 'employee'), validate(createLeaveSchema), ctrl.create);
router.patch('/:id', authorize('admin', 'manager'), validate(updateLeaveSchema), ctrl.update);
router.delete('/:id', authorize('admin'), ctrl.remove);

export default router;
