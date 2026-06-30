import { Router } from 'express';
import * as ctrl from './analytics.controller';
import { authenticate, authorize, scopeDepartment } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { workHoursQuerySchema } from './analytics.schema';

const router = Router();
router.use(authenticate);

router.get('/dashboard', authorize('admin', 'manager', 'employee'), ctrl.dashboard);
router.get(
  '/work-hours',
  authorize('admin', 'manager'),
  scopeDepartment,
  validate(workHoursQuerySchema, 'query'),
  ctrl.workHours,
);

router.get(
  '/work-hours/export',
  authorize('admin', 'manager'),
  scopeDepartment,
  validate(workHoursQuerySchema, 'query'),
  ctrl.exportWorkHours,
);

export default router;
