"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEmployees = listEmployees;
exports.getEmployeeById = getEmployeeById;
exports.createEmployee = createEmployee;
exports.updateEmployee = updateEmployee;
exports.softDeleteEmployee = softDeleteEmployee;
const employee_model_1 = __importDefault(require("./employee.model"));
const user_model_1 = __importDefault(require("../auth/user.model"));
const department_model_1 = __importDefault(require("../departments/department.model"));
const errorHandler_1 = require("../../middleware/errorHandler");
const utils_1 = require("../../shared/utils");
async function listEmployees(query, departmentFilter) {
    const { page, limit, skip } = (0, utils_1.getPagination)(query);
    const filter = { isActive: true };
    if (departmentFilter)
        filter.department = departmentFilter;
    if (query.department)
        filter.department = query.department;
    if (typeof query.isActive === 'boolean')
        filter.isActive = query.isActive;
    if (query.search) {
        const regex = new RegExp(query.search, 'i');
        filter.$or = [
            { firstName: regex },
            { lastName: regex },
            { email: regex },
            { position: regex },
        ];
    }
    const [data, total] = await Promise.all([
        employee_model_1.default.find(filter)
            .populate('department', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        employee_model_1.default.countDocuments(filter),
    ]);
    return {
        success: true,
        data: data,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
}
async function getEmployeeById(id) {
    const employee = await employee_model_1.default.findById(id)
        .populate('department', 'name description')
        .lean();
    if (!employee)
        throw new errorHandler_1.AppError('Employee not found.', 404);
    return employee;
}
async function createEmployee(input) {
    const dept = await department_model_1.default.findById(input.department);
    if (!dept || !dept.isActive)
        throw new errorHandler_1.AppError('Department not found.', 404);
    // Block duplicate department heads
    if (input.isDepartmentHead) {
        const existing = await employee_model_1.default.findOne({
            department: input.department,
            isDepartmentHead: true,
            isActive: true,
        });
        if (existing) {
            throw new errorHandler_1.AppError('This department already has a head.', 409);
        }
    }
    const employee = await employee_model_1.default.create({
        ...input,
        dob: new Date(input.dob),
        hireDate: new Date(input.hireDate),
    });
    // Create linked user account
    const role = input.isDepartmentHead ? 'manager' : 'employee';
    await user_model_1.default.create({
        email: input.email,
        password: 'Password@123', // employee must change on first login
        role,
        employee: employee._id,
    });
    // Update department head reference
    if (input.isDepartmentHead) {
        await department_model_1.default.findByIdAndUpdate(input.department, {
            head: employee._id,
        });
    }
    return employee;
}
async function updateEmployee(id, input) {
    const employee = await employee_model_1.default.findByIdAndUpdate(id, {
        ...input,
        ...(input.dob && { dob: new Date(input.dob) }),
        ...(input.hireDate && { hireDate: new Date(input.hireDate) }),
    }, { new: true, runValidators: true }).populate('department', 'name');
    if (!employee)
        throw new errorHandler_1.AppError('Employee not found.', 404);
    // Sync email change to linked user
    if (input.email) {
        await user_model_1.default.findOneAndUpdate({ employee: id }, { email: input.email });
    }
    return employee;
}
async function softDeleteEmployee(id) {
    const employee = await employee_model_1.default.findByIdAndUpdate(id, { isActive: false });
    if (!employee)
        throw new errorHandler_1.AppError('Employee not found.', 404);
    // Deactivate linked user account as well
    await user_model_1.default.findOneAndUpdate({ employee: id }, { isActive: false });
}
//# sourceMappingURL=employee.service.js.map