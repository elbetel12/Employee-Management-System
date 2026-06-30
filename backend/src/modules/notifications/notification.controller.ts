import { Response, NextFunction } from 'express';
import * as svc from './notification.service';
import { asyncHandler } from '../../shared/utils';
import { AuthRequest } from '../../middleware/auth';

export const getUnread = asyncHandler(
  async (req: AuthRequest, res: Response, _: NextFunction): Promise<void> => {
    const notifications = await svc.getUnreadNotifications(req.user!.id);
    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount: notifications.length,
    });
  },
);

export const markRead = asyncHandler(
  async (req: AuthRequest, res: Response, _: NextFunction): Promise<void> => {
    await svc.markAsRead(req.params.id, req.user!.id);
    res.status(200).json({ success: true, message: 'Notification marked as read.' });
  },
);

export const markAllRead = asyncHandler(
  async (req: AuthRequest, res: Response, _: NextFunction): Promise<void> => {
    await svc.markAllAsRead(req.user!.id);
    res.status(200).json({ success: true, message: 'All notifications marked as read.' });
  },
);
