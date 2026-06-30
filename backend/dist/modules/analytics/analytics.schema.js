"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workHoursQuerySchema = void 0;
const zod_1 = require("zod");
exports.workHoursQuerySchema = zod_1.z.object({
    month: zod_1.z.coerce.number().min(1).max(12),
    year: zod_1.z.coerce.number().min(2000),
    department: zod_1.z.string().optional(),
});
//# sourceMappingURL=analytics.schema.js.map