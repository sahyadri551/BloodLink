import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PropTypes from 'prop-types';

function HospitalOrAdminRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const isHospital = currentUser.role === 'hospital' && currentUser.isVerified === true;
  const isAdmin = currentUser.role === 'admin';

  if (isHospital || isAdmin) {
    return children;
  }

  console.warn("Access denied. User is not a verified hospital or admin.");
  return <Navigate to="/" replace />;
}

HospitalOrAdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default HospitalOrAdminRoute;