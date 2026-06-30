"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPayrolls = listPayrolls;
exports.generatePayroll = generatePayroll;
exports.updatePayroll = updatePayroll;
exports.getPayrollById = getPayrollById;
const employee_model_1 = __importDefault(require("../employees/employee.model"));
const payroll_model_1 = __importDefault(require("./payroll.model"));
const notification_model_1 = __importDefault(require("../notifications/notification.model"));
const user_model_1 = __importDefault(require("../auth/user.model"));
const errorHandler_1 = require("../../middleware/errorHandler");
const utils_1 = require("../../shared/utils");
const attendance_service_1 = require("../attendance/attendance.service");
async function listPayrolls(query, departmentFilter) {
    const { page, limit, skip } = (0, utils_1.getPagination)(query);
    const filter = {};
    if (query.employeeId)
        filter.employee = query.employeeId;
    if (query.month)
        filter.month = query.month;
    if (query.year)
        filter.year = query.year;
    if (departmentFilter) {
        const empIds = await employee_model_1.default.find({ department: departmentFilter }).distinct('_id');
        filter.employee = { $in: empIds };
    }
    const [data, total] = await Promise.all([
        payroll_model_1.default.find(filter)
            .populate('employee', 'firstName lastName department position')
            .sort({ year: -1, month: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        payroll_model_1.default.countDocuments(filter),
    ]);
    return {
        success: true,
        data: data,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
}
async function generatePayroll(input) {
    const payDate = new Date(input.payDate);
    const month = payDate.getMonth() + 1;
    const year = payDate.getFullYear();
    const employees = await employee_model_1.default.find({ isActive: true });
    let created = 0;
    let skipped = 0;
    for (const emp of employees) {
        const already = await payroll_model_1.default.findOne({ employee: emp._id, month, year });
        if (already) {
            skipped++;
            continue;
        }
        const totalHours = await (0, attendance_service_1.calcTotalHours)(emp._id.toString(), month, year);
        if (totalHours === 0) {
            // No-work notification
            const empUser = await user_model_1.default.findOne({ employee: emp._id }).select('_id');
            if (empUser) {
                await notification_model_1.default.create({
                    user: empUser._id,
                    message: `No payroll generated for ${month}/${year} due to zero hours worked.`,
                });
            }
            skipped++;
            continue;
        }
        const { earnedSalary, deductions, taxes, netPay } = (0, utils_1.calcPayroll)({
            baseSalary: emp.salary,
            totalHoursWorked: totalHours,
        });
        const payroll = await payroll_model_1.default.create({
            employee: emp._id,
            payDate,
            month,
            year,
            baseSalary: earnedSalary,
            bonuses: 0,
            deductions,
            taxes,
            netPay,
        });
        // Notify employee
        const empUser = await user_model_1.default.findOne({ employee: emp._id }).select('_id');
        if (empUser) {
            await notification_model_1.default.create({
                user: empUser._id,
                message: `Your payroll for ${month}/${year} has been generated. Net pay: ${netPay.toFixed(2)}.`,
            });
        }
        created++;
    }
    return { created, skipped };
}
async function updatePayroll(id, input) {
    const payroll = await payroll_model_1.default.findById(id);
    if (!payroll)
        throw new errorHandler_1.AppError('Payroll record not found.', 404);
    Object.assign(payroll, input);
    // Recalculate net pay if any component changed
    payroll.netPay =
        payroll.baseSalary + payroll.bonuses - payroll.deductions - payroll.taxes;
    await payroll.save();
    return payroll;
}
async function getPayrollById(id) {
    const payroll = await payroll_model_1.default.findById(id)
        .populate('employee', 'firstName lastName position department email salary');
    if (!payroll)
        throw new errorHandler_1.AppError('Payroll not found.', 404);
    return payroll;
}
//# sourceMappingURL=payroll.service.js.map