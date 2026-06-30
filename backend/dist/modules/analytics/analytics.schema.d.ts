import { z } from 'zod';
export declare const workHoursQuerySchema: z.ZodObject<{
    month: z.ZodNumber;
    year: z.ZodNumber;
    department: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    year: number;
    month: number;
    department?: string | undefined;
}, {
    year: number;
    month: number;
    department?: string | undefined;
}>;
export type WorkHoursQuery = z.infer<typeof workHoursQuerySchema>;
//# sourceMappingURL=analytics.schema.d.ts.map