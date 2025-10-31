import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PropTypes from 'prop-types';

function AdminRoute({ children }) {
  const { currentUser } = useAuth(); // This object NOW has the role!

  if (!currentUser) {
    // 1. Not logged in
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'admin') {
    // 2. Logged in, but NOT an admin.
    console.warn("Access denied. User role is not 'admin'.");
    return <Navigate to="/" replace />;
  }

  // 3. Logged in AND is an admin.
  return children;
}

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminRoute;