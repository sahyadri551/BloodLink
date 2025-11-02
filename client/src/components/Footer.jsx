import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-50 shadow-inner mt-24">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} BloodLink. All rights reserved.
        </p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link to="/blog" className="text-sm text-gray-600 hover:text-primary-600">Blog</Link>
          <Link to="/camps" className="text-sm text-gray-600 hover:text-primary-600">Camps</Link>
          <Link to="/eligibility-check" className="text-sm text-gray-600 hover:text-primary-600">Eligibility</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;