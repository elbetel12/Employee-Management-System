"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.changePassword = exports.logout = exports.refreshToken = exports.login = void 0;
const auth_service_1 = require("./auth.service");
const utils_1 = require("../../shared/utils");
exports.login = (0, utils_1.asyncHandler)(async (req, res, _next) => {
    const { email, password } = req.body;
    const { tokens, user } = await (0, auth_service_1.loginService)(email, password);
    res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: { user, ...tokens },
    });
});
exports.refreshToken = (0, utils_1.asyncHandler)(async (req, res, _next) => {
    const { refreshToken: token } = req.body;
    const { accessToken } = await (0, auth_service_1.refreshTokenService)(token);
    res.status(200).json({ success: true, data: { accessToken } });
});
exports.logout = (0, utils_1.asyncHandler)(async (req, res, _next) => {
    await (0, auth_service_1.logoutService)(req.user.id);
    res.status(200).json({ success: true, message: 'Logged out successfully.' });
});
exports.changePassword = (0, utils_1.asyncHandler)(async (req, res, _next) => {
    const { currentPassword, newPassword } = req.body;
    await (0, auth_service_1.changePasswordService)(req.user.id, currentPassword, newPassword);
    res
        .status(200)
        .json({ success: true, message: 'Password changed successfully.' });
});
exports.getMe = (0, utils_1.asyncHandler)(async (req, res, _next) => {
    res.status(200).json({ success: true, data: req.user });
});
//# sourceMappingURL=auth.controller.js.map