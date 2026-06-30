import { z } from 'zod';
export declare const evaluateSchema: z.ZodObject<{
    comments: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    comments?: string | undefined;
}, {
    comments?: string | undefined;
}>;
export declare const performanceQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    employeeId: z.ZodOptional<z.ZodString>;
    department: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    month: z.ZodOptional<z.ZodNumber>;
    year: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    search?: string | undefined;
    year?: number | undefined;
    department?: string | undefined;
    employeeId?: string | undefined;
    month?: number | undefined;
}, {
    search?: string | undefined;
    limit?: number | undefined;
    year?: number | undefined;
    page?: number | undefined;
    department?: string | undefined;
    employeeId?: string | undefined;
    month?: number | undefined;
}>;
export type EvaluateInput = z.infer<typeof evaluateSchema>;
export type PerformanceQuery = z.infer<typeof performanceQuerySchema>;
//# sourceMappingURL=performance.schema.d.ts.map