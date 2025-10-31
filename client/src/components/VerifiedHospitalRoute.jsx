import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PropTypes from 'prop-types';

function VerifiedHospitalRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // 1. Not logged in
    return <Navigate to="/login" replace />;
  }

  // 2. Check for the specific role AND verification status
  if (currentUser.role !== 'hospital' || currentUser.isVerified !== true) {
    // 3. Not a verified hospital. Redirect to home.
    console.warn("Access denied. User is not a verified hospital.");
    // We could (in the future) redirect to a "Pending Verification" page
    return <Navigate to="/" replace />;
  }

  // 4. Logged in, is a hospital, AND is verified.
  return children;
}

VerifiedHospitalRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default VerifiedHospitalRoute;