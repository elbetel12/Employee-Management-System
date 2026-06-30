"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDepartments = listDepartments;
exports.getDepartmentById = getDepartmentById;
exports.createDepartment = createDepartment;
exports.updateDepartment = updateDepartment;
exports.softDeleteDepartment = softDeleteDepartment;
const department_model_1 = __importDefault(require("./department.model"));
const errorHandler_1 = require("../../middleware/errorHandler");
const utils_1 = require("../../shared/utils");
async function listDepartments(query) {
    const { page, limit, skip } = (0, utils_1.getPagination)(query);
    const filter = { isActive: true };
    if (query.search) {
        filter.name = new RegExp(query.search, 'i');
    }
    const [data, total] = await Promise.all([
        department_model_1.default.find(filter)
            .populate('head', 'firstName lastName position')
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        department_model_1.default.countDocuments(filter),
    ]);
    return {
        success: true,
        data: data,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
}
async function getDepartmentById(id) {
    const dept = await department_model_1.default.findById(id)
        .populate('head', 'firstName lastName position email')
        .lean();
    if (!dept)
        throw new errorHandler_1.AppError('Department not found.', 404);
    return dept;
}
async function createDepartment(input) {
    const exists = await department_model_1.default.findOne({ name: input.name });
    if (exists)
        throw new errorHandler_1.AppError('A department with this name already exists.', 409);
    return department_model_1.default.create(input);
}
async function updateDepartment(id, input) {
    const dept = await department_model_1.default.findByIdAndUpdate(id, input, {
        new: true,
        runValidators: true,
    }).populate('head', 'firstName lastName');
    if (!dept)
        throw new errorHandler_1.AppError('Department not found.', 404);
    return dept;
}
async function softDeleteDepartment(id) {
    const dept = await department_model_1.default.findByIdAndUpdate(id, { isActive: false });
    if (!dept)
        throw new errorHandler_1.AppError('Department not found.', 404);
}
//# sourceMappingURL=department.service.js.map