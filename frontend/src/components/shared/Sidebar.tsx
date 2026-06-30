import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  TrendingUp,
  Bell,
  LogOut,
  User,
  FileSpreadsheet,
} from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

export const Sidebar: React.FC = () => {
  const { user, clearAuth } = useAuthStore();
  const { unreadCount } = useNotifications();

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'manager', 'employee'],
    },
    {
      to: '/employees',
      label: 'Employees',
      icon: Users,
      roles: ['admin', 'manager'],
    },
    {
      to: '/departments',
      label: 'Departments',
      icon: Building2,
      roles: ['admin', 'manager'],
    },
    {
      to: '/attendance',
      label: 'Attendance',
      icon: CalendarCheck,
      roles: ['admin', 'manager', 'employee'],
    },
    {
      to: '/leaves',
      label: 'Leaves',
      icon: CalendarDays,
      roles: ['admin', 'manager', 'employee'],
    },
    {
      to: '/payrolls',
      label: 'Payroll',
      icon: CreditCard,
      roles: ['admin', 'manager'],
    },
    {
      to: '/performance',
      label: 'Performance',
      icon: TrendingUp,
      roles: ['admin', 'manager', 'employee'],
    },
    {
      to: '/reports',
      label: 'Reports',
      icon: FileSpreadsheet,
      roles: ['admin', 'manager'],
    },
    {
      to: '/profile',
      label: 'Profile',
      icon: User,
      roles: ['admin', 'manager', 'employee'],
    },
  ];

  const filteredItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <aside className="w-64 bg-card border-r flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md shadow-primary/20">
            EM
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            EMS Portal
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/10'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
            </NavLink>
          );
        })}

        {/* Notifications NavLink (always available to auth users) */}
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/10'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`
          }
        >
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </div>
          {unreadCount > 0 && (
            <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </NavLink>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t space-y-4">
        {user && (
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center border text-secondary-foreground font-semibold">
              {user.email[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate leading-none mb-1">
                {user.email.split('@')[0]}
              </p>
              <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10">
                {user.role.toUpperCase()}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
