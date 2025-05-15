import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import RoleRedirect from './components/RoleRedirect';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import ChangePassword from './pages/ChangePassword';

// Placeholder components until fully implemented
const Employees = () => <div>Employees</div>;
const Leaves = () => <div>Leaves</div>;
const Attendance = () => <div>Attendance</div>;
const Payrolls = () => <div>Payrolls</div>;
const WorkHoursReport = () => <div>Work Hours Report</div>;
const MonthlyWorkHoursReport = () => <div>Monthly Work Hours Report</div>;
const Evaluations = () => <div>Evaluations</div>;

// Role-specific dashboards (to be implemented)
const AdminDashboard = () => <div><h2>Admin Dashboard</h2><p>This dashboard is only visible to administrators</p></div>;
const HRDashboard = () => <div><h2>HR Dashboard</h2><p>This dashboard is only visible to HR personnel</p></div>;
const EmployeeDashboard = () => <div><h2>Employee Dashboard</h2><p>This dashboard is for regular employees</p></div>;

const App: React.FC = () => {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Redirect based on role */}
        <Route path="/" element={<RoleRedirect />} />
        
        {/* Role-specific dashboards */}
        <Route path="/admin" element={
          <RoleBasedRoute allowedRoles={['admin']}>
            <Layout><AdminDashboard /></Layout>
          </RoleBasedRoute>
        } />
        
        <Route path="/hr" element={
          <RoleBasedRoute allowedRoles={['hr']}>
            <Layout><HRDashboard /></Layout>
          </RoleBasedRoute>
        } />
        
        <Route path="/employee" element={
          <RoleBasedRoute allowedRoles={['user', 'employee']}>
            <Layout><EmployeeDashboard /></Layout>
          </RoleBasedRoute>
        } />
        
        <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
        
        {/* Admin and HR only routes */}
        <Route path="/departments" element={
          <RoleBasedRoute allowedRoles={['admin', 'hr']}>
            <Layout><Departments /></Layout>
          </RoleBasedRoute>
        } />
        
        <Route path="/employees" element={
          <RoleBasedRoute allowedRoles={['admin', 'hr']}>
            <Layout><Employees /></Layout>
          </RoleBasedRoute>
        } />
        
        <Route path="/payrolls" element={
          <RoleBasedRoute allowedRoles={['admin', 'hr']}>
            <Layout><Payrolls /></Layout>
          </RoleBasedRoute>
        } />
        
        {/* HR only routes */}
        <Route path="/leaves" element={
          <RoleBasedRoute allowedRoles={['hr']}>
            <Layout><Leaves /></Layout>
          </RoleBasedRoute>
        } />
        
        <Route path="/attendance" element={
          <RoleBasedRoute allowedRoles={['hr']}>
            <Layout><Attendance /></Layout>
          </RoleBasedRoute>
        } />
        
        <Route path="/work-hours-report" element={
          <RoleBasedRoute allowedRoles={['hr']}>
            <Layout><WorkHoursReport /></Layout>
          </RoleBasedRoute>
        } />
        
        <Route path="/monthly-work-hours-report" element={
          <RoleBasedRoute allowedRoles={['hr']}>
            <Layout><MonthlyWorkHoursReport /></Layout>
          </RoleBasedRoute>
        } />
        
        <Route path="/evaluations" element={
          <RoleBasedRoute allowedRoles={['hr']}>
            <Layout><Evaluations /></Layout>
          </RoleBasedRoute>
        } />
        
        <Route path="/change-password" element={<PrivateRoute><Layout><ChangePassword /></Layout></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default App; 