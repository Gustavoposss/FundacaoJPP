import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

