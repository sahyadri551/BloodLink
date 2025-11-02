import React from 'react';
import { Link } from 'react-router-dom';

function LoggedOutHome() {
  return (
    <div className="max-w-4xl mx-auto mt-20 p-8 text-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">
        Welcome to BloodLink
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Connecting blood donors with recipients in real-time. Your donation can save a life.
      </p>
      
      <div className="flex justify-center gap-4">
        <Link
          to="/register"
          className="bg-red-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-red-700 transition"
        >
          Register to Donate
        </Link>
        <Link
          to="/active-requests"
          className="bg-gray-200 text-gray-800 px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-300 transition"
        >
          View Active Requests
        </Link>
      </div>
      <div className="mt-6">
        <Link
          to="/eligibility-check"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Not sure if you can donate? Check your eligibility first.
        </Link>
      </div>
    </div>
  );
}

export default LoggedOutHome;