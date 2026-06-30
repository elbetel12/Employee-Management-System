import { Router } from 'express';
import * as ctrl from './attendance.controller';
import { authenticate, authorize, scopeDepartment } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  qrCheckSchema,
  manualAttendanceSchema,
  updateAttendanceSchema,
  attendanceQuerySchema,
} from './attendance.schema';

const router = Router();
router.use(authenticate);

router.get(
  '/',
  authorize('admin', 'manager', 'employee'),
  scopeDepartment,
  validate(attendanceQuerySchema, 'query'),
  ctrl.list,
);

router.post('/qr', validate(qrCheckSchema), ctrl.qrScan);

router.post(
  '/manual',
  authorize('admin', 'manager'),
  validate(manualAttendanceSchema),
  ctrl.manualEntry,
);

router.patch(
  '/:id',
  authorize('admin', 'manager'),
  validate(updateAttendanceSchema),
  ctrl.update,
);

export default router;
