import { z } from 'zod';
export declare const qrCheckSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export declare const manualAttendanceSchema: z.ZodObject<{
    employeeId: z.ZodString;
    date: z.ZodOptional<z.ZodString>;
    checkIn: z.ZodOptional<z.ZodString>;
    checkOut: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    employeeId: string;
    date?: string | undefined;
    checkIn?: string | undefined;
    checkOut?: string | undefined;
}, {
    employeeId: string;
    date?: string | undefined;
    checkIn?: string | undefined;
    checkOut?: string | undefined;
}>;
export declare const updateAttendanceSchema: z.ZodObject<{
    checkIn: z.ZodOptional<z.ZodString>;
    checkOut: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    checkIn?: string | undefined;
    checkOut?: string | undefined;
}, {
    checkIn?: string | undefined;
    checkOut?: string | undefined;
}>;
export declare const attendanceQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    employeeId: z.ZodOptional<z.ZodString>;
    department: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    department?: string | undefined;
    employeeId?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}, {
    limit?: number | undefined;
    page?: number | undefined;
    department?: string | undefined;
    employeeId?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}>;
export type QrCheckInput = z.infer<typeof qrCheckSchema>;
export type ManualAttendanceInput = z.infer<typeof manualAttendanceSchema>;
export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
export type AttendanceQuery = z.infer<typeof attendanceQuerySchema>;
//# sourceMappingURL=attendance.schema.d.ts.map