"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorize = authorize;
exports.scopeDepartment = scopeDepartment;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const errorHandler_1 = require("./errorHandler");
const user_model_1 = __importDefault(require("../modules/auth/user.model"));
function authenticate(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return next(new errorHandler_1.AppError('No token provided.', 401));
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.config.jwt.accessSecret);
        req.user = payload;
        next();
    }
    catch {
        next(new errorHandler_1.AppError('Invalid or expired token.', 401));
    }
}
function authorize(...roles) {
    return (req, _res, next) => {
        if (!req.user)
            return next(new errorHandler_1.AppError('Unauthenticated.', 401));
        if (!roles.includes(req.user.role)) {
            return next(new errorHandler_1.AppError('You do not have permission to perform this action.', 403));
        }
        next();
    };
}
// Scope: managers can only see their department's employees
async function scopeDepartment(req, _res, next) {
    try {
        if (!req.user)
            return next(new errorHandler_1.AppError('Unauthenticated.', 401));
        if (req.user.role === 'admin')
            return next(); // admins see everything
        const user = await user_model_1.default.findById(req.user.id).populate({
            path: 'employee',
            select: 'department',
        });
        if (!user?.employee) {
            return next(new errorHandler_1.AppError('User has no linked employee record.', 400));
        }
        // Attach the department id to the request for controller use
        req.departmentId = user.employee.department?.toString();
        next();
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=auth.js.map