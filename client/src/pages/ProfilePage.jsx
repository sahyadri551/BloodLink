import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import DonorProfile from './DonorProfile';
import HospitalProfile from './HospitalProfile'; 

function ProfilePage() {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <div className="text-center mt-20">Loading profile...</div>;
  }

  switch (currentUser.role) {
    case 'donor':
      return <DonorProfile />;
    case 'hospital':
      return <HospitalProfile />;
    case 'admin':
      return <DonorProfile />;
    default:
      return (
        <div className="text-center mt-20">
          <h1 className="text-2xl font-bold text-red-600">Unknown user role.</h1>
        </div>
      );
  }
}

export default ProfilePage;