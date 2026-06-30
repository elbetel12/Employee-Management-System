export type UserRole = 'admin' | 'manager' | 'employee';
export type Gender = 'Male' | 'Female';
export type LeaveType = 'Sick' | 'Vacation' | 'Maternity' | 'Paternity' | 'Unpaid' | 'Annual' | 'Casual' | 'Education';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
export type PerformanceRating = 1 | 2 | 3 | 4 | 5;
export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface PaginatedResponse<T> {
    success: true;
    data: T[];
    meta: PaginationMeta;
}
export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
}
export interface TokenPayload {
    id: string;
    role: UserRole;
    email: string;
    employeeId?: string;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
//# sourceMappingURL=index.d.ts.map