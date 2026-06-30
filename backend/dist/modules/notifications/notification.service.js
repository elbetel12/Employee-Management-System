"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnreadNotifications = getUnreadNotifications;
exports.markAsRead = markAsRead;
exports.markAllAsRead = markAllAsRead;
const notification_model_1 = __importDefault(require("./notification.model"));
const errorHandler_1 = require("../../middleware/errorHandler");
async function getUnreadNotifications(userId) {
    const notifications = await notification_model_1.default.find({ user: userId, isRead: false })
        .populate('leave', 'leaveType startDate endDate status')
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();
    return notifications;
}
async function markAsRead(notificationId, userId) {
    const notification = await notification_model_1.default.findOneAndUpdate({ _id: notificationId, user: userId }, { isRead: true });
    if (!notification)
        throw new errorHandler_1.AppError('Notification not found.', 404);
}
async function markAllAsRead(userId) {
    await notification_model_1.default.updateMany({ user: userId, isRead: false }, { isRead: true });
}
//# sourceMappingURL=notification.service.js.map