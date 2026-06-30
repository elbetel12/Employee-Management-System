import { z } from 'zod';
export declare const createLeaveSchema: z.ZodEffects<z.ZodObject<{
    employeeId: z.ZodString;
    leaveType: z.ZodEnum<["Sick", "Vacation", "Maternity", "Paternity", "Unpaid", "Annual", "Casual", "Education"]>;
    startDate: z.ZodString;
    endDate: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    employeeId: string;
    startDate: string;
    endDate: string;
    leaveType: "Sick" | "Vacation" | "Maternity" | "Paternity" | "Unpaid" | "Annual" | "Casual" | "Education";
    reason?: string | undefined;
}, {
    employeeId: string;
    startDate: string;
    endDate: string;
    leaveType: "Sick" | "Vacation" | "Maternity" | "Paternity" | "Unpaid" | "Annual" | "Casual" | "Education";
    reason?: string | undefined;
}>, {
    employeeId: string;
    startDate: string;
    endDate: string;
    leaveType: "Sick" | "Vacation" | "Maternity" | "Paternity" | "Unpaid" | "Annual" | "Casual" | "Education";
    reason?: string | undefined;
}, {
    employeeId: string;
    startDate: string;
    endDate: string;
    leaveType: "Sick" | "Vacation" | "Maternity" | "Paternity" | "Unpaid" | "Annual" | "Casual" | "Education";
    reason?: string | undefined;
}>;
export declare const updateLeaveSchema: z.ZodObject<{
    leaveType: z.ZodOptional<z.ZodEnum<["Sick", "Vacation", "Maternity", "Paternity", "Unpaid", "Annual", "Casual", "Education"]>>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["Pending", "Approved", "Rejected", "Cancelled"]>>;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "Pending" | "Approved" | "Rejected" | "Cancelled" | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    leaveType?: "Sick" | "Vacation" | "Maternity" | "Paternity" | "Unpaid" | "Annual" | "Casual" | "Education" | undefined;
    reason?: string | undefined;
}, {
    status?: "Pending" | "Approved" | "Rejected" | "Cancelled" | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    leaveType?: "Sick" | "Vacation" | "Maternity" | "Paternity" | "Unpaid" | "Annual" | "Casual" | "Education" | undefined;
    reason?: string | undefined;
}>;
export declare const leaveQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<["Pending", "Approved", "Rejected", "Cancelled"]>>;
    employeeId: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    search?: string | undefined;
    status?: "Pending" | "Approved" | "Rejected" | "Cancelled" | undefined;
    employeeId?: string | undefined;
}, {
    search?: string | undefined;
    limit?: number | undefined;
    page?: number | undefined;
    status?: "Pending" | "Approved" | "Rejected" | "Cancelled" | undefined;
    employeeId?: string | undefined;
}>;
export type CreateLeaveInput = z.infer<typeof createLeaveSchema>;
export type UpdateLeaveInput = z.infer<typeof updateLeaveSchema>;
export type LeaveQuery = z.infer<typeof leaveQuerySchema>;
//# sourceMappingURL=leave.schema.d.ts.map