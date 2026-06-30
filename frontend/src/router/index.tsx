import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '../components/shared/Layout';
import { ProtectedRoute } from '../components/shared/ProtectedRoute';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { Employees } from '../pages/Employees';
import { Departments } from '../pages/Departments';
import { AttendancePage } from '../pages/Attendance';
import { LeavesPage } from '../pages/Leaves';
import { PayrollPage } from '../pages/Payroll';
import { PerformancePage } from '../pages/Performance';
import { NotificationsPage } from '../pages/Notifications';
import { Unauthorized } from '../pages/Unauthorized';
import { ReportsPage } from '../pages/Reports';
import { ProfilePage } from '../pages/Profile';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'employees',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <Employees />
          </ProtectedRoute>
        ),
      },
      {
        path: 'departments',
        element: <Departments />,
      },
      {
        path: 'attendance',
        element: <AttendancePage />,
      },
      {
        path: 'leaves',
        element: <LeavesPage />,
      },
      {
        path: 'payrolls',
        element: <PayrollPage />,
      },
      {
        path: 'performance',
        element: <PerformancePage />,
      },
      {
        path: 'reports',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <ReportsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'notifications',
        element: <NotificationsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
