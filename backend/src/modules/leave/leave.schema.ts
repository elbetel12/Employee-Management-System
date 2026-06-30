import { z } from 'zod';

export const createLeaveSchema = z.object({
  employeeId: z.string().length(24, 'Invalid employee ID'),
  leaveType: z.enum([
    'Sick', 'Vacation', 'Maternity', 'Paternity',
    'Unpaid', 'Annual', 'Casual', 'Education',
  ]),
  startDate: z.string().date('Invalid start date'),
  endDate: z.string().date('Invalid end date'),
  reason: z.string().min(1).optional(),
}).refine(
  (d) => new Date(d.endDate) >= new Date(d.startDate),
  { message: 'End date must be on or after start date', path: ['endDate'] },
);

export const updateLeaveSchema = z.object({
  leaveType: z.enum([
    'Sick', 'Vacation', 'Maternity', 'Paternity',
    'Unpaid', 'Annual', 'Casual', 'Education',
  ]).optional(),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
  status: z.enum(['Pending', 'Approved', 'Rejected', 'Cancelled']).optional(),
  reason: z.string().optional(),
});

export const leaveQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  status: z.enum(['Pending', 'Approved', 'Rejected', 'Cancelled']).optional(),
  employeeId: z.string().optional(),
  search: z.string().optional(),
});

export type CreateLeaveInput = z.infer<typeof createLeaveSchema>;
export type UpdateLeaveInput = z.infer<typeof updateLeaveSchema>;
export type LeaveQuery = z.infer<typeof leaveQuerySchema>;
