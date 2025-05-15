import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === 'admin';
  const isHR = user?.role === 'hr';
  const isAdminOrHR = isAdmin || isHR;
  const isEmployee = user?.role === 'user' || user?.role === 'employee';

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  // Get the appropriate dashboard link based on user role
  const getDashboardLink = () => {
    if (isAdmin) return '/admin';
    if (isHR) return '/hr';
    if (isEmployee) return '/employee';
    return '/dashboard';
  };

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        <li className="nav-item nav-profile">
          <a href="#" className="nav-link">
            <div className="nav-profile-image">
              <img src="/images/faces/face1.jpg" alt="profile" />
              <span className="login-status online"></span>
            </div>
            <div className="nav-profile-text d-flex flex-column">
              {user && (
                <>
                  <span className="font-weight-bold mb-2">
                    {user.first_name} {user.last_name}
                  </span>
                  <span className="text-secondary text-small">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </>
              )}
            </div>
            <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
          </a>
        </li>

        <li className={`nav-item ${isActive(getDashboardLink())}`}>
          <Link className="nav-link" to={getDashboardLink()}>
            <span className="menu-title">Dashboard</span>
            <i className="mdi mdi-home menu-icon"></i>
          </Link>
        </li>

        {/* Common dashboard for all roles */}
        <li className={`nav-item ${isActive('/dashboard')}`}>
          <Link className="nav-link" to="/dashboard">
            <span className="menu-title">General Dashboard</span>
            <i className="mdi mdi-view-dashboard menu-icon"></i>
          </Link>
        </li>

        {/* Admin and HR only */}
        {isAdminOrHR && (
          <li className={`nav-item ${isActive('/employees')}`}>
            <Link className="nav-link" to="/employees">
              <span className="menu-title">Employees</span>
              <i className="mdi mdi-account-multiple menu-icon"></i>
            </Link>
          </li>
        )}

        {/* Admin and HR only */}
        {isAdminOrHR && (
          <li className={`nav-item ${isActive('/departments')}`}>
            <Link className="nav-link" to="/departments">
              <span className="menu-title">Departments</span>
              <i className="mdi mdi-office-building menu-icon"></i>
            </Link>
          </li>
        )}

        {/* HR only */}
        {isHR && (
          <li className={`nav-item ${isActive('/leaves')}`}>
            <Link className="nav-link" to="/leaves">
              <span className="menu-title">Leave Management</span>
              <i className="mdi mdi-calendar-blank menu-icon"></i>
            </Link>
          </li>
        )}

        {/* HR only */}
        {isHR && (
          <li className={`nav-item ${isActive('/attendance')}`}>
            <Link className="nav-link" to="/attendance">
              <span className="menu-title">Attendance</span>
              <i className="mdi mdi-clipboard-check menu-icon"></i>
            </Link>
          </li>
        )}

        {/* HR only */}
        {isHR && (
          <li className={`nav-item ${isActive('/evaluations')}`}>
            <Link className="nav-link" to="/evaluations">
              <span className="menu-title">Performance Evaluation</span>
              <i className="mdi mdi-chart-line menu-icon"></i>
            </Link>
          </li>
        )}

        {/* HR only */}
        {isHR && (
          <li className={`nav-item ${isActive('/work-hours-report')}`}>
            <Link className="nav-link" to="/work-hours-report">
              <span className="menu-title">Work Hours Report</span>
              <i className="mdi mdi-clock menu-icon"></i>
            </Link>
          </li>
        )}

        {/* HR only */}
        {isHR && (
          <li className={`nav-item ${isActive('/monthly-work-hours-report')}`}>
            <Link className="nav-link" to="/monthly-work-hours-report">
              <span className="menu-title">Monthly Report</span>
              <i className="mdi mdi-chart-bar menu-icon"></i>
            </Link>
          </li>
        )}

        {/* Admin and HR only */}
        {isAdminOrHR && (
          <li className={`nav-item ${isActive('/payrolls')}`}>
            <Link className="nav-link" to="/payrolls">
              <span className="menu-title">Payroll</span>
              <i className="mdi mdi-cash-multiple menu-icon"></i>
            </Link>
          </li>
        )}

        {/* All users */}
        <li className={`nav-item ${isActive('/change-password')}`}>
          <Link className="nav-link" to="/change-password">
            <span className="menu-title">Change Password</span>
            <i className="mdi mdi-key menu-icon"></i>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar; 