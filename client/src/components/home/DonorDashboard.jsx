import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

function DonorDashboard() {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Welcome back, {currentUser.username || currentUser.name}!
      </h1>

      <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Your Stats</h2>
        <div className="flex flex-wrap gap-4">
          <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
            🏆 {currentUser.badges?.length || 0} Badges Earned
          </span>
          <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
            🩸 {currentUser.donationCount || 0} Donations
          </span>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Quick Links</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/profile" className="block p-6 bg-white shadow rounded-lg hover:shadow-md transition">
          <h3 className="font-semibold text-lg text-blue-600">My Profile</h3>
          <p className="text-sm text-gray-500">Update your info and view badges.</p>
        </Link>
        <Link to="/find-donors" className="block p-6 bg-white shadow rounded-lg hover:shadow-md transition">
          <h3 className="font-semibold text-lg text-blue-600">Find Donors</h3>
          <p className="text-sm text-gray-500">Search for available donors.</p>
        </Link>
        <Link to="/request-blood" className="block p-6 bg-red-50 border-red-200 border rounded-lg hover:shadow-md transition">
          <h3 className="font-semibold text-lg text-red-600">Request Blood</h3>
          <p className="text-sm text-gray-500">Post a new urgent request.</p>
        </Link>
      </div>
    </div>
  );
}

export default DonorDashboard;