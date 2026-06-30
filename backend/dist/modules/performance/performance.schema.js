"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performanceQuerySchema = exports.evaluateSchema = void 0;
const zod_1 = require("zod");
exports.evaluateSchema = zod_1.z.object({
    comments: zod_1.z.string().optional(),
});
exports.performanceQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10),
    employeeId: zod_1.z.string().optional(),
    department: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    month: zod_1.z.coerce.number().min(1).max(12).optional(),
    year: zod_1.z.coerce.number().min(2000).optional(),
});
//# sourceMappingURL=performance.schema.js.map