import { z } from 'zod';

export const evaluateSchema = z.object({
  comments: z.string().optional(),
});

export const performanceQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  employeeId: z.string().optional(),
  department: z.string().optional(),
  search: z.string().optional(),
  month: z.coerce.number().min(1).max(12).optional(),
  year: z.coerce.number().min(2000).optional(),
});

export type EvaluateInput = z.infer<typeof evaluateSchema>;
export type PerformanceQuery = z.infer<typeof performanceQuerySchema>;
