import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PropTypes from 'prop-types';

function VerifiedHospitalRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (currentUser.role !== 'hospital' || currentUser.isVerified !== true) {
    console.warn("Access denied. User is not a verified hospital.");
    return <Navigate to="/" replace />;
  }

  return children;
}

VerifiedHospitalRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default VerifiedHospitalRoute;