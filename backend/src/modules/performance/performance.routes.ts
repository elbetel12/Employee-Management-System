import { Router } from 'express';
import * as ctrl from './performance.controller';
import { authenticate, authorize, scopeDepartment } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { evaluateSchema, performanceQuerySchema } from './performance.schema';

const router = Router();
router.use(authenticate);

router.get(
  '/',
  authorize('admin', 'manager', 'employee'),
  scopeDepartment,
  validate(performanceQuerySchema, 'query'),
  ctrl.list,
);
router.post(
  '/:employeeId/evaluate',
  authorize('admin', 'manager'),
  validate(evaluateSchema),
  ctrl.evaluate,
);

export default router;
