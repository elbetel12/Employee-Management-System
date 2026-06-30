import Employee from '../employees/employee.model';
import Department from '../departments/department.model';
import Attendance from '../attendance/attendance.model';
import Leave from '../leave/leave.model';
import Payroll from '../payroll/payroll.model';
import Performance from '../performance/performance.model';

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
    hireDate: Date;
  }[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalEmployees,
    totalDepartments,
    newHiresThisMonth,
    pendingLeaves,
    presentToday,
    departments,
    leaveStats,
    payrollAgg,
    perfAgg,
    recentHires,
  ] = await Promise.all([
    Employee.countDocuments({ isActive: true }),
    Department.countDocuments({ isActive: true }),
    Employee.countDocuments({ isActive: true, hireDate: { $gte: startOfMonth } }),
    Leave.countDocuments({ status: 'Pending' }),
    Attendance.countDocuments({ date: today, checkIn: { $ne: null } }),

    // Employees per department
    Employee.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'departments',
          localField: '_id',
          foreignField: '_id',
          as: 'dept',
        },
      },
      { $unwind: '$dept' },
      { $project: { name: '$dept.name', count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    ]),

    // Leave status breakdown
    Leave.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } },
    ]),

    // Monthly payroll total
    Payroll.aggregate([
      {
        $match: {
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        },
      },
      { $group: { _id: null, total: { $sum: '$netPay' } } },
    ]),

    // Average performance rating
    Performance.aggregate([
      {
        $match: {
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        },
      },
      { $group: { _id: null, avg: { $avg: '$rating' } } },
    ]),

    // Recent hires (last 5)
    Employee.find({ isActive: true })
      .sort({ hireDate: -1 })
      .limit(5)
      .populate('department', 'name')
      .select('firstName lastName position department hireDate')
      .lean(),
  ]);

  return {
    totalEmployees,
    totalDepartments,
    newHiresThisMonth,
    pendingLeaves,
    presentToday,
    employeesByDepartment: departments,
    leaveStatusBreakdown: leaveStats,
    monthlyPayrollTotal: payrollAgg[0]?.total ?? 0,
    avgPerformanceRating: parseFloat((perfAgg[0]?.avg ?? 0).toFixed(1)),
    recentHires: recentHires.map((e) => ({
      name: `${e.firstName} ${e.lastName}`,
      position: e.position,
      department: (e.department as unknown as { name: string })?.name ?? '',
      hireDate: e.hireDate,
    })),
  };
}

export interface WorkHoursReport {
  employeeId: string;
  name: string;
  department: string;
  totalHours: number;
  dailyBreakdown: { date: string; hours: number }[];
}

export async function getWorkHoursReport(
  month: number,
  year: number,
  departmentId?: string,
): Promise<WorkHoursReport[]> {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const empFilter: Record<string, unknown> = { isActive: true };
  if (departmentId) empFilter.department = departmentId;

  const employees = await Employee.find(empFilter)
    .populate('department', 'name')
    .lean();

  const results: WorkHoursReport[] = [];

  for (const emp of employees) {
    const records = await Attendance.find({
      employee: emp._id,
      date: { $gte: start, $lte: end },
    }).lean();

    const dailyBreakdown = records.map((r) => {
      const hours =
        r.checkIn && r.checkOut
          ? parseFloat(
              (
                (new Date(r.checkOut).getTime() - new Date(r.checkIn).getTime()) /
                3_600_000
              ).toFixed(2),
            )
          : 0;
      return { date: new Date(r.date).toISOString().split('T')[0], hours };
    });

    const totalHours = dailyBreakdown.reduce((s, d) => s + d.hours, 0);

    results.push({
      employeeId: emp._id.toString(),
      name: `${emp.firstName} ${emp.lastName}`,
      department: (emp.department as unknown as { name: string })?.name ?? '',
      totalHours: parseFloat(totalHours.toFixed(2)),
      dailyBreakdown,
    });
  }

  return results;
}
