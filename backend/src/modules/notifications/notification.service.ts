import Notification, { INotification } from './notification.model';
import { AppError } from '../../middleware/errorHandler';

export async function getUnreadNotifications(
  userId: string,
): Promise<INotification[]> {
  const notifications = await Notification.find({ user: userId, isRead: false })
    .populate('leave', 'leaveType startDate endDate status')
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();
  return notifications as unknown as INotification[];
}

export async function markAsRead(
  notificationId: string,
  userId: string,
): Promise<void> {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true },
  );
  if (!notification) throw new AppError('Notification not found.', 404);
}

export async function markAllAsRead(userId: string): Promise<void> {
  await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
}
