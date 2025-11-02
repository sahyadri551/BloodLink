import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

function HospitalDashboard() {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Welcome, {currentUser.name || currentUser.username}!
      </h1>

      {!currentUser.isVerified && (
        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg">
          <h2 className="font-bold">Your Account is Pending Approval</h2>
          <p>An admin is currently reviewing your hospital registration. Once approved, you will be able to post blood camps and confirm donations.</p>
        </div>
      )}

      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Hospital Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/profile" className="block p-6 bg-white shadow rounded-lg hover:shadow-md transition">
          <h3 className="font-semibold text-lg text-blue-600">My Profile</h3>
          <p className="text-sm text-gray-500">Update your organization's info.</p>
        </Link>

        <Link 
          to="/create-camp" 
          className={`block p-6 bg-white shadow rounded-lg ${!currentUser.isVerified ? 'opacity-50 pointer-events-none' : 'hover:shadow-md transition'}`}
        >
          <h3 className="font-semibold text-lg text-blue-600">Create Blood Camp</h3>
          <p className="text-sm text-gray-500">Post a new donation drive.</p>
        </Link>
        <Link 
          to="/confirm-donation" 
          className={`block p-6 bg-green-50 border-green-200 border rounded-lg ${!currentUser.isVerified ? 'opacity-50 pointer-events-none' : 'hover:shadow-md transition'}`}
        >
          <h3 className="font-semibold text-lg text-green-600">Confirm Donation</h3>
          <p className="text-sm text-gray-500">Confirm a donation to award badges.</p>
        </Link>
      </div>
    </div>
  );
}

export default HospitalDashboard;