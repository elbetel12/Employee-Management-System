import { Router } from 'express';
import * as ctrl from './department.controller';
import { authenticate, authorize } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  createDepartmentSchema,
  updateDepartmentSchema,
  departmentQuerySchema,
} from './department.schema';

const router = Router();
router.use(authenticate);

router.get('/', validate(departmentQuerySchema, 'query'), ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/', authorize('admin'), validate(createDepartmentSchema), ctrl.create);
router.patch('/:id', authorize('admin'), validate(updateDepartmentSchema), ctrl.update);
router.delete('/:id', authorize('admin'), ctrl.remove);

export default router;
