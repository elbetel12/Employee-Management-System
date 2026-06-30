"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listLeaves = listLeaves;
exports.createLeave = createLeave;
exports.updateLeave = updateLeave;
exports.deleteLeave = deleteLeave;
const leave_model_1 = __importDefault(require("./leave.model"));
const employee_model_1 = __importDefault(require("../employees/employee.model"));
const department_model_1 = __importDefault(require("../departments/department.model"));
const notification_model_1 = __importDefault(require("../notifications/notification.model"));
const user_model_1 = __importDefault(require("../auth/user.model"));
const errorHandler_1 = require("../../middleware/errorHandler");
const utils_1 = require("../../shared/utils");
async function listLeaves(query, departmentFilter) {
    const { page, limit, skip } = (0, utils_1.getPagination)(query);
    const filter = {};
    if (query.status)
        filter.status = query.status;
    if (query.employeeId)
        filter.employee = query.employeeId;
    if (departmentFilter) {
        const empIds = await employee_model_1.default.find({ department: departmentFilter }).distinct('_id');
        filter.employee = { $in: empIds };
    }
    if (query.search) {
        const empIds = await employee_model_1.default.find({
            $or: [
                { firstName: new RegExp(query.search, 'i') },
                { lastName: new RegExp(query.search, 'i') },
            ],
        }).distinct('_id');
        filter.employee = { $in: empIds };
    }
    const [data, total] = await Promise.all([
        leave_model_1.default.find(filter)
            .populate('employee', 'firstName lastName email department')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        leave_model_1.default.countDocuments(filter),
    ]);
    return {
        success: true,
        data: data,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
}
async function createLeave(input, requestingUserId) {
    const employee = await employee_model_1.default.findById(input.employeeId);
    if (!employee)
        throw new errorHandler_1.AppError('Employee not found.', 404);
    // 1-year tenure gate
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    if (employee.hireDate > oneYearAgo) {
        throw new errorHandler_1.AppError('Employees must have been employed for at least 1 year to apply for leave.', 400);
    }
    // Max 3 leaves per calendar year
    const currentYear = new Date().getFullYear();
    const leaveCount = await leave_model_1.default.countDocuments({
        employee: input.employeeId,
        startDate: {
            $gte: new Date(currentYear, 0, 1),
            $lte: new Date(currentYear, 11, 31),
        },
    });
    if (leaveCount >= 3) {
        throw new errorHandler_1.AppError('Employees may apply for leave only 3 times per year.', 400);
    }
    // Duplicate check
    const duplicate = await leave_model_1.default.findOne({
        employee: input.employeeId,
        leaveType: input.leaveType,
        startDate: new Date(input.startDate),
    });
    if (duplicate) {
        throw new errorHandler_1.AppError('A leave with the same type and start date already exists.', 409);
    }
    const leave = await leave_model_1.default.create({
        employee: input.employeeId,
        leaveType: input.leaveType,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
        reason: input.reason,
    });
    // Notify department head if applicable
    const dept = await department_model_1.default.findById(employee.department);
    if (dept && dept.head) {
        const headUser = await user_model_1.default.findOne({ employee: dept.head, isActive: true }).select('_id');
        if (headUser) {
            await notification_model_1.default.create({
                user: headUser._id,
                message: `${employee.firstName} ${employee.lastName} requested ${input.leaveType} leave from ${input.startDate} to ${input.endDate}.`,
                leave: leave._id,
            });
        }
    }
    // Notify all admin users
    const admins = await user_model_1.default.find({ role: 'admin', isActive: true }).select('_id');
    await notification_model_1.default.insertMany(admins.map((admin) => ({
        user: admin._id,
        message: `${employee.firstName} ${employee.lastName} applied for ${input.leaveType} leave from ${input.startDate} to ${input.endDate}.`,
        leave: leave._id,
    })));
    return leave;
}
async function updateLeave(id, input) {
    const leave = await leave_model_1.default.findById(id).populate('employee');
    if (!leave)
        throw new errorHandler_1.AppError('Leave not found.', 404);
    const previousStatus = leave.status;
    Object.assign(leave, {
        ...(input.leaveType && { leaveType: input.leaveType }),
        ...(input.startDate && { startDate: new Date(input.startDate) }),
        ...(input.endDate && { endDate: new Date(input.endDate) }),
        ...(input.status && { status: input.status }),
        ...(input.reason && { reason: input.reason }),
    });
    await leave.save();
    // Notify the employee when status changes
    if (input.status && input.status !== previousStatus) {
        const empUser = await user_model_1.default.findOne({ employee: leave.employee }).select('_id');
        if (empUser) {
            await notification_model_1.default.create({
                user: empUser._id,
                message: `Your ${leave.leaveType} leave request from ${leave.startDate.toDateString()} to ${leave.endDate.toDateString()} has been ${leave.status}.`,
                leave: leave._id,
            });
        }
    }
    return leave;
}
async function deleteLeave(id) {
    const leave = await leave_model_1.default.findByIdAndDelete(id);
    if (!leave)
        throw new errorHandler_1.AppError('Leave not found.', 404);
}
//# sourceMappingURL=leave.service.js.map