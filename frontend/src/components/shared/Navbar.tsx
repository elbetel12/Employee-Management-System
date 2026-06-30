import React, { useEffect, useState } from 'react';
import { Sun, Moon, Bell } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNotifications } from '../../hooks/useNotifications';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user } = useAuthStore();
  const { unreadCount } = useNotifications();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Dynamic greeting */}
        <h1 className="text-lg font-bold text-foreground capitalize">
          Welcome back, {user?.email.split('@')[0]}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-lg bg-secondary hover:bg-accent border flex items-center justify-center transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-500" />
          )}
        </button>

        {/* Notifications Icon linking to notifications page */}
        <Link
          to="/notifications"
          className="w-10 h-10 rounded-lg bg-secondary hover:bg-accent border flex items-center justify-center relative transition-colors"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Profile Avatar Card */}
        {user && (
          <Link to="/profile" className="flex items-center gap-3 border-l pl-4 hover:opacity-85 transition-opacity">
            <div className="text-right">
              <p className="text-xs font-semibold text-foreground truncate leading-none">
                {user.email.split('@')[0]}
              </p>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {user.role}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md shadow-primary/10">
              {user.email[0].toUpperCase()}
            </div>
          </Link>
        )}
      </div>
    </header>
  );
};
