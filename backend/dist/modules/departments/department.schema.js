"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentQuerySchema = exports.updateDepartmentSchema = exports.createDepartmentSchema = void 0;
const zod_1 = require("zod");
exports.createDepartmentSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').trim(),
    description: zod_1.z.string().min(1, 'Description is required').trim(),
    head: zod_1.z.string().length(24).optional(),
});
exports.updateDepartmentSchema = exports.createDepartmentSchema.partial();
exports.departmentQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10),
    search: zod_1.z.string().optional(),
});
//# sourceMappingURL=department.schema.js.map