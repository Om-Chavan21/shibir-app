import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  // Show loading while authentication state is being determined
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Not authenticated -> redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: window.location.pathname }} />;
  }
  
  // Role check if roles array is provided
  if (roles.length > 0 && !roles.includes(user?.role)) {
    // Redirect to home if role doesn't match
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;