import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoggedOutHome from '../components/home/LoggedOutHome';
import DonorDashboard from '../components/home/DonorDashboard';
import HospitalDashboard from '../components/home/HospitalDashboard';

function Home() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <LoggedOutHome />;
  }

  if (currentUser.role === 'hospital') {
    return <HospitalDashboard />;
  }
  
  if (currentUser.role === 'donor' || currentUser.role === 'admin') {
    return <DonorDashboard />;
  }

  return <LoggedOutHome />;
}

export default Home;