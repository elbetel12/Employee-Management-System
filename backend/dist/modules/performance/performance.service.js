"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPerformances = listPerformances;
exports.evaluateEmployee = evaluateEmployee;
const performance_model_1 = __importDefault(require("./performance.model"));
const employee_model_1 = __importDefault(require("../employees/employee.model"));
const notification_model_1 = __importDefault(require("../notifications/notification.model"));
const user_model_1 = __importDefault(require("../auth/user.model"));
const errorHandler_1 = require("../../middleware/errorHandler");
const utils_1 = require("../../shared/utils");
const attendance_service_1 = require("../attendance/attendance.service");
async function listPerformances(query, departmentFilter) {
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
        performance_model_1.default.find(filter)
            .populate('employee', 'firstName lastName department position')
            .populate('evaluatedBy', 'email role')
            .sort({ year: -1, month: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        performance_model_1.default.countDocuments(filter),
    ]);
    return {
        success: true,
        data: data,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
}
async function evaluateEmployee(employeeId, evaluatorUserId, input) {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    // One evaluation per month per employee
    const exists = await performance_model_1.default.findOne({ employee: employeeId, month, year });
    if (exists) {
        throw new errorHandler_1.AppError('This employee has already been evaluated for this month.', 409);
    }
    const totalHours = await (0, attendance_service_1.calcTotalHours)(employeeId, month, year);
    if (totalHours === 0) {
        const emp = await employee_model_1.default.findById(employeeId);
        const empUser = await user_model_1.default.findOne({ employee: employeeId }).select('_id');
        if (empUser && emp) {
            await notification_model_1.default.create({
                user: empUser._id,
                message: `No performance evaluation for ${emp.firstName} ${emp.lastName} this month — no hours worked.`,
            });
        }
        throw new errorHandler_1.AppError('Cannot evaluate: employee worked 0 hours this month.', 400);
    }
    const rating = (0, utils_1.calcPerformanceRating)(totalHours);
    const perf = await performance_model_1.default.create({
        employee: employeeId,
        rating,
        comments: input.comments,
        evaluatedBy: evaluatorUserId,
        month,
        year,
    });
    const empUser = await user_model_1.default.findOne({ employee: employeeId, isActive: true }).select('_id');
    if (empUser) {
        const monthName = new Date(0, month - 1).toLocaleString('en-US', { month: 'long' });
        await notification_model_1.default.create({
            user: empUser._id,
            message: `Your performance for ${monthName} ${year} has been evaluated. Rating: ${rating}/5.`,
        });
    }
    return perf;
}
//# sourceMappingURL=performance.service.js.map