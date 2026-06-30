import { INotification } from './notification.model';
export declare function getUnreadNotifications(userId: string): Promise<INotification[]>;
export declare function markAsRead(notificationId: string, userId: string): Promise<void>;
export declare function markAllAsRead(userId: string): Promise<void>;
//# sourceMappingURL=notification.service.d.ts.map