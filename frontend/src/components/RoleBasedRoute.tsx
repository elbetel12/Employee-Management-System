import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ children, allowedRoles }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If user doesn't have the required role, redirect to dashboard
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  // If user is authenticated and has the required role, render the children
  return <>{children}</>;
};

export default RoleBasedRoute; 