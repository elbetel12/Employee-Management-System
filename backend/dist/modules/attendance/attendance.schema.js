"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceQuerySchema = exports.updateAttendanceSchema = exports.manualAttendanceSchema = exports.qrCheckSchema = void 0;
const zod_1 = require("zod");
exports.qrCheckSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid employee email in QR data'),
});
exports.manualAttendanceSchema = zod_1.z.object({
    employeeId: zod_1.z.string().length(24, 'Invalid employee ID'),
    date: zod_1.z.string().date().optional(),
    checkIn: zod_1.z.string().datetime({ offset: true }).optional(),
    checkOut: zod_1.z.string().datetime({ offset: true }).optional(),
});
exports.updateAttendanceSchema = zod_1.z.object({
    checkIn: zod_1.z.string().datetime({ offset: true }).optional(),
    checkOut: zod_1.z.string().datetime({ offset: true }).optional(),
});
exports.attendanceQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(20),
    employeeId: zod_1.z.string().optional(),
    department: zod_1.z.string().optional(),
    startDate: zod_1.z.string().date().optional(),
    endDate: zod_1.z.string().date().optional(),
});
//# sourceMappingURL=attendance.schema.js.map