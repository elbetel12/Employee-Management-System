import { z } from 'zod';

export const createDepartmentSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  description: z.string().min(1, 'Description is required').trim(),
  head: z.string().length(24).optional(),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

export const departmentQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
export type DepartmentQuery = z.infer<typeof departmentQuerySchema>;
