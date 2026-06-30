import { z } from 'zod';

export const workHoursQuerySchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000),
  department: z.string().optional(),
});

export type WorkHoursQuery = z.infer<typeof workHoursQuerySchema>;
