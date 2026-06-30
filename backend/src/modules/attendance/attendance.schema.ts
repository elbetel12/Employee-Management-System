import { z } from 'zod';

export const qrCheckSchema = z.object({
  email: z.string().email('Invalid employee email in QR data'),
});

export const manualAttendanceSchema = z.object({
  employeeId: z.string().length(24, 'Invalid employee ID'),
  date: z.string().date().optional(),
  checkIn: z.string().datetime({ offset: true }).optional(),
  checkOut: z.string().datetime({ offset: true }).optional(),
});

export const updateAttendanceSchema = z.object({
  checkIn: z.string().datetime({ offset: true }).optional(),
  checkOut: z.string().datetime({ offset: true }).optional(),
});

export const attendanceQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  employeeId: z.string().optional(),
  department: z.string().optional(),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
});

export type QrCheckInput = z.infer<typeof qrCheckSchema>;
export type ManualAttendanceInput = z.infer<typeof manualAttendanceSchema>;
export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
export type AttendanceQuery = z.infer<typeof attendanceQuerySchema>;
