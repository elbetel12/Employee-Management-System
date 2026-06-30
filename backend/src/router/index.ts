import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import employeeRoutes from '../modules/employees/employee.routes';
import departmentRoutes from '../modules/departments/department.routes';
import attendanceRoutes from '../modules/attendance/attendance.routes';
import leaveRoutes from '../modules/leave/leave.routes';
import payrollRoutes from '../modules/payroll/payroll.routes';
import performanceRoutes from '../modules/performance/performance.routes';
import notificationRoutes from '../modules/notifications/notification.routes';
import analyticsRoutes from '../modules/analytics/analytics.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/departments', departmentRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/leaves', leaveRoutes);
router.use('/payrolls', payrollRoutes);
router.use('/performance', performanceRoutes);
router.use('/notifications', notificationRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
