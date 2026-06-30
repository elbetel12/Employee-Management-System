import { Router } from 'express';
import * as authController from './auth.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  loginSchema,
  refreshSchema,
  changePasswordSchema,
} from './auth.schema';

const router = Router();

// Public
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshSchema), authController.refreshToken);

// Protected
router.use(authenticate);
router.post('/logout', authController.logout);
router.get('/me', authController.getMe);
router.patch(
  '/change-password',
  validate(changePasswordSchema),
  authController.changePassword,
);

export default router;
