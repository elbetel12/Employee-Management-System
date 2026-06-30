"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payrollQuerySchema = exports.updatePayrollSchema = exports.generatePayrollSchema = void 0;
const zod_1 = require("zod");
exports.generatePayrollSchema = zod_1.z.object({
    payDate: zod_1.z.string().date('Invalid date — use YYYY-MM-DD'),
});
exports.updatePayrollSchema = zod_1.z.object({
    bonuses: zod_1.z.coerce.number().min(0).optional(),
    deductions: zod_1.z.coerce.number().min(0).optional(),
    taxes: zod_1.z.coerce.number().min(0).optional(),
    netPay: zod_1.z.coerce.number().optional(),
});
exports.payrollQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10),
    employeeId: zod_1.z.string().optional(),
    month: zod_1.z.coerce.number().min(1).max(12).optional(),
    year: zod_1.z.coerce.number().min(2000).optional(),
    department: zod_1.z.string().optional(),
});
//# sourceMappingURL=payroll.schema.js.map