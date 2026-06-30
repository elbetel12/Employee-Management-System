"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const employee_routes_1 = __importDefault(require("../modules/employees/employee.routes"));
const department_routes_1 = __importDefault(require("../modules/departments/department.routes"));
const attendance_routes_1 = __importDefault(require("../modules/attendance/attendance.routes"));
const leave_routes_1 = __importDefault(require("../modules/leave/leave.routes"));
const payroll_routes_1 = __importDefault(require("../modules/payroll/payroll.routes"));
const performance_routes_1 = __importDefault(require("../modules/performance/performance.routes"));
const notification_routes_1 = __importDefault(require("../modules/notifications/notification.routes"));
const analytics_routes_1 = __importDefault(require("../modules/analytics/analytics.routes"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/employees', employee_routes_1.default);
router.use('/departments', department_routes_1.default);
router.use('/attendance', attendance_routes_1.default);
router.use('/leaves', leave_routes_1.default);
router.use('/payrolls', payroll_routes_1.default);
router.use('/performance', performance_routes_1.default);
router.use('/notifications', notification_routes_1.default);
router.use('/analytics', analytics_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map