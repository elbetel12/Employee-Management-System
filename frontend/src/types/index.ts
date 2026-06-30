export type UserRole = 'admin' | 'manager' | 'employee';

export type Gender = 'Male' | 'Female';

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

export type PerformanceRating = 1 | 2 | 3 | 4 | 5;

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  employee?: string | Employee;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dob: string;
  gender: Gender;
  address: string;
  phone: string;
  email: string;
  position: string;
  department: string | Department;
  hireDate: string;
  salary: number;
  isDepartmentHead: boolean;
  avatar?: string;
  qrCode?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  _id: string;
  name: string;
  description: string;
  head?: string | Employee;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  _id: string;
  employee: string | Employee;
  date: string;
  checkIn?: string;
  checkOut?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Leave {
  _id: string;
  employee: string | Employee;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  document?: string;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payroll {
  _id: string;
  employee: string | Employee;
  payDate: string;
  month: number;
  year: number;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  taxes: number;
  netPay: number;
  createdAt: string;
  updatedAt: string;
}

export interface Performance {
  _id: string;
  employee: string | Employee;
  rating: PerformanceRating;
  comments?: string;
  evaluatedBy: string | User;
  month: number;
  year: number;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  user: string;
  message: string;
  leave?: string | Leave;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  newHiresThisMonth: number;
  pendingLeaves: number;
  presentToday: number;
  employeesByDepartment: { name: string; count: number }[];
  leaveStatusBreakdown: { status: string; count: number }[];
  monthlyPayrollTotal: number;
  avgPerformanceRating: number;
  recentHires: {
    name: string;
    position: string;
    department: string;
    hireDate: string;
  }[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}
