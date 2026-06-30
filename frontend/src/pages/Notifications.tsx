import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Check, BellRing, Sparkles } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markAsRead(id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">Keep track of corporate updates, leaves, and payroll logs.</p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllRead} variant="outline" className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* List */}
      <Card>
        <CardContent className="p-0 divide-y">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif._id}
                className={`p-5 flex items-start gap-4 transition-colors hover:bg-secondary/10 ${
                  !notif.isRead ? 'bg-primary/5 dark:bg-primary/5 border-l-4 border-l-primary' : ''
                }`}
              >
                <div className={`p-2 rounded-xl mt-0.5 ${
                  !notif.isRead
                    ? 'bg-primary/10 text-primary'
                    : 'bg-secondary text-muted-foreground'
                }`}>
                  <BellRing className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-normal mb-1">
                    {notif.message}
                  </p>
                  <span className="text-xs text-muted-foreground font-medium">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
                {!notif.isRead && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-primary/10"
                    onClick={() => handleMarkRead(notif._id)}
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4 text-primary" />
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-muted-foreground text-sm flex flex-col items-center justify-center space-y-3">
              <Sparkles className="w-10 h-10 text-muted-foreground/60" />
              <span>You are all caught up! No unread notifications.</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default NotificationsPage;
