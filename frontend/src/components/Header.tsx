import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { logout } from '../features/auth/authSlice';

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
      <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
        <Link className="navbar-brand brand-logo" to="/">
          <img src="/images/ems-logo.svg" alt="logo" />
        </Link>
        <Link className="navbar-brand brand-logo-mini" to="/">
          <img src="/images/ems-logo-mini.svg" alt="logo" />
        </Link>
      </div>
      <div className="navbar-menu-wrapper d-flex align-items-stretch">
        <button
          className="navbar-toggler navbar-toggler align-self-center"
          type="button"
          data-toggle="minimize"
        >
          <span className="mdi mdi-menu"></span>
        </button>
        <div className="search-field d-none d-md-block">
          <form className="d-flex align-items-center h-100" action="#">
            <div className="input-group">
              <div className="input-group-prepend bg-transparent">
                <i className="input-group-text border-0 mdi mdi-magnify"></i>
              </div>
              <input
                type="text"
                className="form-control bg-transparent border-0"
                placeholder="Search"
              />
            </div>
          </form>
        </div>
        <ul className="navbar-nav navbar-nav-right">
          <li className="nav-item nav-profile dropdown">
            <a
              className="nav-link dropdown-toggle"
              id="profileDropdown"
              href="#"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div className="nav-profile-img">
                <img src="/images/faces/face1.jpg" alt="profile" />
                <span className="availability-status online"></span>
              </div>
              <div className="nav-profile-text">
                <p className="mb-1 text-black">
                  {user && `${user.first_name} ${user.last_name}`}
                </p>
              </div>
            </a>
            <div
              className="dropdown-menu navbar-dropdown"
              aria-labelledby="profileDropdown"
            >
              <Link className="dropdown-item" to="/change-password">
                <i className="mdi mdi-cached me-2 text-success"></i> Change Password
              </Link>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item" href="#" onClick={handleLogout}>
                <i className="mdi mdi-logout me-2 text-primary"></i> Signout
              </a>
            </div>
          </li>
          <li className="nav-item d-none d-lg-block full-screen-link">
            <a className="nav-link">
              <i className="mdi mdi-fullscreen" id="fullscreen-button"></i>
            </a>
          </li>
          <li className="nav-item dropdown">
            <a className="nav-link count-indicator dropdown-toggle" id="notificationDropdown" href="#" data-bs-toggle="dropdown">
              <i className="mdi mdi-bell-outline"></i>
              <span className="count-symbol bg-danger"></span>
            </a>
            <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="notificationDropdown">
              <h6 className="p-3 mb-0">Notifications</h6>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item preview-item">
                <div className="preview-thumbnail">
                  <div className="preview-icon bg-success">
                    <i className="mdi mdi-calendar"></i>
                  </div>
                </div>
                <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                  <h6 className="preview-subject font-weight-normal mb-1">Event today</h6>
                  <p className="text-gray ellipsis mb-0"> Just a reminder that you have an event today </p>
                </div>
              </a>
              <div className="dropdown-divider"></div>
              <h6 className="p-3 mb-0 text-center">See all notifications</h6>
            </div>
          </li>
          <li className="nav-item nav-logout d-none d-lg-block">
            <a className="nav-link" href="#" onClick={handleLogout}>
              <i className="mdi mdi-power"></i>
            </a>
          </li>
        </ul>
        <button
          className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
          type="button"
          data-toggle="offcanvas"
        >
          <span className="mdi mdi-menu"></span>
        </button>
      </div>
    </nav>
  );
};

export default Header; 