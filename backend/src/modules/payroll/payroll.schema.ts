import { z } from 'zod';

export const generatePayrollSchema = z.object({
  payDate: z.string().date('Invalid date — use YYYY-MM-DD'),
});

export const updatePayrollSchema = z.object({
  bonuses: z.coerce.number().min(0).optional(),
  deductions: z.coerce.number().min(0).optional(),
  taxes: z.coerce.number().min(0).optional(),
  netPay: z.coerce.number().optional(),
});

export const payrollQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  employeeId: z.string().optional(),
  month: z.coerce.number().min(1).max(12).optional(),
  year: z.coerce.number().min(2000).optional(),
  department: z.string().optional(),
});

export type GeneratePayrollInput = z.infer<typeof generatePayrollSchema>;
export type UpdatePayrollInput = z.infer<typeof updatePayrollSchema>;
export type PayrollQuery = z.infer<typeof payrollQuerySchema>;
