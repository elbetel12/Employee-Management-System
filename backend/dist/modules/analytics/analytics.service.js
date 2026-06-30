"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = getDashboardStats;
exports.getWorkHoursReport = getWorkHoursReport;
const employee_model_1 = __importDefault(require("../employees/employee.model"));
const department_model_1 = __importDefault(require("../departments/department.model"));
const attendance_model_1 = __importDefault(require("../attendance/attendance.model"));
const leave_model_1 = __importDefault(require("../leave/leave.model"));
const payroll_model_1 = __importDefault(require("../payroll/payroll.model"));
const performance_model_1 = __importDefault(require("../performance/performance.model"));
async function getDashboardStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [totalEmployees, totalDepartments, newHiresThisMonth, pendingLeaves, presentToday, departments, leaveStats, payrollAgg, perfAgg, recentHires,] = await Promise.all([
        employee_model_1.default.countDocuments({ isActive: true }),
        department_model_1.default.countDocuments({ isActive: true }),
        employee_model_1.default.countDocuments({ isActive: true, hireDate: { $gte: startOfMonth } }),
        leave_model_1.default.countDocuments({ status: 'Pending' }),
        attendance_model_1.default.countDocuments({ date: today, checkIn: { $ne: null } }),
        // Employees per department
        employee_model_1.default.aggregate([
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
        leave_model_1.default.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $project: { status: '$_id', count: 1, _id: 0 } },
        ]),
        // Monthly payroll total
        payroll_model_1.default.aggregate([
            {
                $match: {
                    month: now.getMonth() + 1,
                    year: now.getFullYear(),
                },
            },
            { $group: { _id: null, total: { $sum: '$netPay' } } },
        ]),
        // Average performance rating
        performance_model_1.default.aggregate([
            {
                $match: {
                    month: now.getMonth() + 1,
                    year: now.getFullYear(),
                },
            },
            { $group: { _id: null, avg: { $avg: '$rating' } } },
        ]),
        // Recent hires (last 5)
        employee_model_1.default.find({ isActive: true })
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
            department: e.department?.name ?? '',
            hireDate: e.hireDate,
        })),
    };
}
async function getWorkHoursReport(month, year, departmentId) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    const empFilter = { isActive: true };
    if (departmentId)
        empFilter.department = departmentId;
    const employees = await employee_model_1.default.find(empFilter)
        .populate('department', 'name')
        .lean();
    const results = [];
    for (const emp of employees) {
        const records = await attendance_model_1.default.find({
            employee: emp._id,
            date: { $gte: start, $lte: end },
        }).lean();
        const dailyBreakdown = records.map((r) => {
            const hours = r.checkIn && r.checkOut
                ? parseFloat(((new Date(r.checkOut).getTime() - new Date(r.checkIn).getTime()) /
                    3_600_000).toFixed(2))
                : 0;
            return { date: new Date(r.date).toISOString().split('T')[0], hours };
        });
        const totalHours = dailyBreakdown.reduce((s, d) => s + d.hours, 0);
        results.push({
            employeeId: emp._id.toString(),
            name: `${emp.firstName} ${emp.lastName}`,
            department: emp.department?.name ?? '',
            totalHours: parseFloat(totalHours.toFixed(2)),
            dailyBreakdown,
        });
    }
    return results;
}
//# sourceMappingURL=analytics.service.js.map