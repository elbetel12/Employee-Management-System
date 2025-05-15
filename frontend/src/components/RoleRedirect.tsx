import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const RoleRedirect = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Navigate to="/login" />;
  }

  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin" />;
    case 'hr':
      return <Navigate to="/hr" />;
    case 'user':
    case 'employee':
      return <Navigate to="/employee" />;
    default:
      return <Navigate to="/login" />;
  }
};

export default RoleRedirect; 