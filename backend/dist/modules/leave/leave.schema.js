"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveQuerySchema = exports.updateLeaveSchema = exports.createLeaveSchema = void 0;
const zod_1 = require("zod");
exports.createLeaveSchema = zod_1.z.object({
    employeeId: zod_1.z.string().length(24, 'Invalid employee ID'),
    leaveType: zod_1.z.enum([
        'Sick', 'Vacation', 'Maternity', 'Paternity',
        'Unpaid', 'Annual', 'Casual', 'Education',
    ]),
    startDate: zod_1.z.string().date('Invalid start date'),
    endDate: zod_1.z.string().date('Invalid end date'),
    reason: zod_1.z.string().min(1).optional(),
}).refine((d) => new Date(d.endDate) >= new Date(d.startDate), { message: 'End date must be on or after start date', path: ['endDate'] });
exports.updateLeaveSchema = zod_1.z.object({
    leaveType: zod_1.z.enum([
        'Sick', 'Vacation', 'Maternity', 'Paternity',
        'Unpaid', 'Annual', 'Casual', 'Education',
    ]).optional(),
    startDate: zod_1.z.string().date().optional(),
    endDate: zod_1.z.string().date().optional(),
    status: zod_1.z.enum(['Pending', 'Approved', 'Rejected', 'Cancelled']).optional(),
    reason: zod_1.z.string().optional(),
});
exports.leaveQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10),
    status: zod_1.z.enum(['Pending', 'Approved', 'Rejected', 'Cancelled']).optional(),
    employeeId: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
});
//# sourceMappingURL=leave.schema.js.map