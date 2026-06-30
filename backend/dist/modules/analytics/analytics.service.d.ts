export interface DashboardStats {
    totalEmployees: number;
    totalDepartments: number;
    newHiresThisMonth: number;
    pendingLeaves: number;
    presentToday: number;
    employeesByDepartment: {
        name: string;
        count: number;
    }[];
    leaveStatusBreakdown: {
        status: string;
        count: number;
    }[];
    monthlyPayrollTotal: number;
    avgPerformanceRating: number;
    recentHires: {
        name: string;
        position: string;
        department: string;
        hireDate: Date;
    }[];
}
export declare function getDashboardStats(): Promise<DashboardStats>;
export interface WorkHoursReport {
    employeeId: string;
    name: string;
    department: string;
    totalHours: number;
    dailyBreakdown: {
        date: string;
        hours: number;
    }[];
}
export declare function getWorkHoursReport(month: number, year: number, departmentId?: string): Promise<WorkHoursReport[]>;
//# sourceMappingURL=analytics.service.d.ts.map