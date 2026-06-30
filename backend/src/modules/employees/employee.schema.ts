import { z } from 'zod';

export const createEmployeeSchema = z.object({
  firstName: z.string().min(1).regex(/^[A-Za-z]+$/, 'Letters only'),
  lastName: z.string().min(1).regex(/^[A-Za-z]+$/, 'Letters only'),
  dob: z.string().date('Invalid date'),
  gender: z.enum(['Male', 'Female']),
  address: z.string().min(1),
  phone: z.string().min(7),
  email: z.string().email(),
  position: z.string().min(1),
  department: z.string().length(24, 'Invalid department ID'),
  hireDate: z.string().date('Invalid date'),
  salary: z.coerce.number().min(0),
  isDepartmentHead: z.boolean().default(false),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export const employeeQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  department: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
export type EmployeeQuery = z.infer<typeof employeeQuerySchema>;
