import { z } from 'zod';
export declare const createEmployeeSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    dob: z.ZodString;
    gender: z.ZodEnum<["Male", "Female"]>;
    address: z.ZodString;
    phone: z.ZodString;
    email: z.ZodString;
    position: z.ZodString;
    department: z.ZodString;
    hireDate: z.ZodString;
    salary: z.ZodNumber;
    isDepartmentHead: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    email: string;
    department: string;
    firstName: string;
    lastName: string;
    dob: string;
    gender: "Male" | "Female";
    address: string;
    phone: string;
    position: string;
    hireDate: string;
    salary: number;
    isDepartmentHead: boolean;
}, {
    email: string;
    department: string;
    firstName: string;
    lastName: string;
    dob: string;
    gender: "Male" | "Female";
    address: string;
    phone: string;
    position: string;
    hireDate: string;
    salary: number;
    isDepartmentHead?: boolean | undefined;
}>;
export declare const updateEmployeeSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    dob: z.ZodOptional<z.ZodString>;
    gender: z.ZodOptional<z.ZodEnum<["Male", "Female"]>>;
    address: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    position: z.ZodOptional<z.ZodString>;
    department: z.ZodOptional<z.ZodString>;
    hireDate: z.ZodOptional<z.ZodString>;
    salary: z.ZodOptional<z.ZodNumber>;
    isDepartmentHead: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    department?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    dob?: string | undefined;
    gender?: "Male" | "Female" | undefined;
    address?: string | undefined;
    phone?: string | undefined;
    position?: string | undefined;
    hireDate?: string | undefined;
    salary?: number | undefined;
    isDepartmentHead?: boolean | undefined;
}, {
    email?: string | undefined;
    department?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    dob?: string | undefined;
    gender?: "Male" | "Female" | undefined;
    address?: string | undefined;
    phone?: string | undefined;
    position?: string | undefined;
    hireDate?: string | undefined;
    salary?: number | undefined;
    isDepartmentHead?: boolean | undefined;
}>;
export declare const employeeQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
    department: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    isActive?: boolean | undefined;
    search?: string | undefined;
    department?: string | undefined;
}, {
    isActive?: boolean | undefined;
    search?: string | undefined;
    limit?: number | undefined;
    page?: number | undefined;
    department?: string | undefined;
}>;
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
export type EmployeeQuery = z.infer<typeof employeeQuerySchema>;
//# sourceMappingURL=employee.schema.d.ts.map