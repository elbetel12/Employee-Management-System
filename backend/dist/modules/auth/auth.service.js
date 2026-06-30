"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = loginService;
exports.refreshTokenService = refreshTokenService;
exports.logoutService = logoutService;
exports.changePasswordService = changePasswordService;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const errorHandler_1 = require("../../middleware/errorHandler");
const user_model_1 = __importDefault(require("./user.model"));
function signAccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, env_1.config.jwt.accessSecret, {
        expiresIn: env_1.config.jwt.accessExpiresIn,
    });
}
function signRefreshToken(payload) {
    return jsonwebtoken_1.default.sign(payload, env_1.config.jwt.refreshSecret, {
        expiresIn: env_1.config.jwt.refreshExpiresIn,
    });
}
async function loginService(email, password) {
    const user = await user_model_1.default.findOne({ email, isActive: true }).select('+password +refreshToken');
    if (!user || !(await user.comparePassword(password))) {
        throw new errorHandler_1.AppError('Invalid email or password.', 401);
    }
    const payload = {
        id: user._id.toString(),
        role: user.role,
        email: user.email,
        employeeId: user.employee?.toString(),
    };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    // Persist hashed refresh token
    user.refreshToken = refreshToken;
    await user.save();
    return {
        tokens: { accessToken, refreshToken },
        user: {
            _id: user._id,
            email: user.email,
            role: user.role,
            employee: user.employee,
        },
    };
}
async function refreshTokenService(token) {
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(token, env_1.config.jwt.refreshSecret);
    }
    catch {
        throw new errorHandler_1.AppError('Invalid or expired refresh token.', 401);
    }
    const user = await user_model_1.default.findById(payload.id).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
        throw new errorHandler_1.AppError('Refresh token revoked or not found.', 401);
    }
    const newPayload = {
        id: user._id.toString(),
        role: user.role,
        email: user.email,
        employeeId: user.employee?.toString(),
    };
    return { accessToken: signAccessToken(newPayload) };
}
async function logoutService(userId) {
    await user_model_1.default.findByIdAndUpdate(userId, { refreshToken: null });
}
async function changePasswordService(userId, currentPassword, newPassword) {
    const user = await user_model_1.default.findById(userId).select('+password');
    if (!user)
        throw new errorHandler_1.AppError('User not found.', 404);
    const valid = await user.comparePassword(currentPassword);
    if (!valid)
        throw new errorHandler_1.AppError('Current password is incorrect.', 400);
    user.password = newPassword;
    user.refreshToken = undefined;
    await user.save();
}
//# sourceMappingURL=auth.service.js.map