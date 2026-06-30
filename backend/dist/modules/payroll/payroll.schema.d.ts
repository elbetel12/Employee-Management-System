import { z } from 'zod';
export declare const generatePayrollSchema: z.ZodObject<{
    payDate: z.ZodString;
}, "strip", z.ZodTypeAny, {
    payDate: string;
}, {
    payDate: string;
}>;
export declare const updatePayrollSchema: z.ZodObject<{
    bonuses: z.ZodOptional<z.ZodNumber>;
    deductions: z.ZodOptional<z.ZodNumber>;
    taxes: z.ZodOptional<z.ZodNumber>;
    netPay: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    bonuses?: number | undefined;
    deductions?: number | undefined;
    taxes?: number | undefined;
    netPay?: number | undefined;
}, {
    bonuses?: number | undefined;
    deductions?: number | undefined;
    taxes?: number | undefined;
    netPay?: number | undefined;
}>;
export declare const payrollQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    employeeId: z.ZodOptional<z.ZodString>;
    month: z.ZodOptional<z.ZodNumber>;
    year: z.ZodOptional<z.ZodNumber>;
    department: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    year?: number | undefined;
    department?: string | undefined;
    employeeId?: string | undefined;
    month?: number | undefined;
}, {
    limit?: number | undefined;
    year?: number | undefined;
    page?: number | undefined;
    department?: string | undefined;
    employeeId?: string | undefined;
    month?: number | undefined;
}>;
export type GeneratePayrollInput = z.infer<typeof generatePayrollSchema>;
export type UpdatePayrollInput = z.infer<typeof updatePayrollSchema>;
export type PayrollQuery = z.infer<typeof payrollQuerySchema>;
//# sourceMappingURL=payroll.schema.d.ts.map