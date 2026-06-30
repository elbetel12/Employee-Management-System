// ─── Roles ────────────────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'manager' | 'employee';

// ─── Gender ───────────────────────────────────────────────────────────────────
export type Gender = 'Male' | 'Female';

// ─── Leave ────────────────────────────────────────────────────────────────────
export type LeaveType =
  | 'Sick'
  | 'Vacation'
  | 'Maternity'
  | 'Paternity'
  | 'Unpaid'
  | 'Annual'
  | 'Casual'
  | 'Education';

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

// ─── Performance ─────────────────────────────────────────────────────────────
export type PerformanceRating = 1 | 2 | 3 | 4 | 5;

// ─── Pagination ───────────────────────────────────────────────────────────────
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

// ─── Generic API Response ─────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
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
