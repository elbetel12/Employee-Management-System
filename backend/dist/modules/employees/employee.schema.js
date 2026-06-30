"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeQuerySchema = exports.updateEmployeeSchema = exports.createEmployeeSchema = void 0;
const zod_1 = require("zod");
exports.createEmployeeSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).regex(/^[A-Za-z]+$/, 'Letters only'),
    lastName: zod_1.z.string().min(1).regex(/^[A-Za-z]+$/, 'Letters only'),
    dob: zod_1.z.string().date('Invalid date'),
    gender: zod_1.z.enum(['Male', 'Female']),
    address: zod_1.z.string().min(1),
    phone: zod_1.z.string().min(7),
    email: zod_1.z.string().email(),
    position: zod_1.z.string().min(1),
    department: zod_1.z.string().length(24, 'Invalid department ID'),
    hireDate: zod_1.z.string().date('Invalid date'),
    salary: zod_1.z.coerce.number().min(0),
    isDepartmentHead: zod_1.z.boolean().default(false),
});
exports.updateEmployeeSchema = exports.createEmployeeSchema.partial();
exports.employeeQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10),
    search: zod_1.z.string().optional(),
    department: zod_1.z.string().optional(),
    isActive: zod_1.z.coerce.boolean().optional(),
});
//# sourceMappingURL=employee.schema.js.map