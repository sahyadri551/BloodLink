import React, { useState } from 'react';
import HospitalApproval from '../components/admin/HospitalApproval';
import ManageUsers from '../components/admin/ManageUsers';
import ManageCamps from '../components/admin/ManageCamps';
import ManageDonations from '../components/admin/ManageDonations';

// Define our tabs
const TABS = {
  APPROVAL: 'Approval',
  USERS: 'Users',
  CAMPS: 'Camps',
  DONATIONS: 'Donations',
};

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(TABS.APPROVAL);

  const renderTabContent = () => {
    switch (activeTab) {
      case TABS.APPROVAL:
        return <HospitalApproval />;
      case TABS.USERS:
        return <ManageUsers />;
      case TABS.CAMPS:
        return <ManageCamps />;
      case TABS.DONATIONS:
        return <ManageDonations />;
      default:
        return <HospitalApproval />;
    }
  };

  const TabButton = ({ title }) => {
    const isActive = activeTab === title;
    return (
      <button
        onClick={() => setActiveTab(title)}
        className={`px-4 py-2 font-medium rounded-md transition-colors ${
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        {title}
      </button>
    );
  };

  return (
    <div className="max-w-6xl mx-auto mt-12 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

      <div className="flex space-x-2 mb-6 border-b pb-2">
        <TabButton title={TABS.APPROVAL} />
        <TabButton title={TABS.USERS} />
        <TabButton title={TABS.CAMPS} />
        <TabButton title={TABS.DONATIONS} />
      </div>

      <div>
        {renderTabContent()}
      </div>
    </div>
  );
}

export default AdminDashboard;