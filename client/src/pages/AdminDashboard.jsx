import React, { useState } from 'react';
import PropTypes from 'prop-types';
import HospitalApproval from '../components/admin/HospitalApproval';
import ManageUsers from '../components/admin/ManageUsers';
import ManageCamps from '../components/admin/ManageCamps';
import ManageDonations from '../components/admin/ManageDonations';
import ManageStories from '../components/admin/ManageStories';

function TabButton({ title, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-medium rounded-md transition-colors ${
        isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {title}
    </button>
  );
}

TabButton.propTypes = {
  title: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const TABS = {
  APPROVAL: 'Approval',
  USERS: 'Users',
  CAMPS: 'Camps',
  DONATIONS: 'Donations',
  STORIES: 'Stories',
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
      case TABS.STORIES:
        return <ManageStories />;
      default:
        return <HospitalApproval />;
    }
  };

  // TabButton was moved to top-level and receives props for active state and click handler

  return (
    <div className="max-w-6xl mx-auto mt-12 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

      <div className="flex space-x-2 mb-6 border-b pb-2">
        <TabButton
          title={TABS.APPROVAL}
          isActive={activeTab === TABS.APPROVAL}
          onClick={() => setActiveTab(TABS.APPROVAL)}
        />
        <TabButton
          title={TABS.USERS}
          isActive={activeTab === TABS.USERS}
          onClick={() => setActiveTab(TABS.USERS)}
        />
        <TabButton
          title={TABS.CAMPS}
          isActive={activeTab === TABS.CAMPS}
          onClick={() => setActiveTab(TABS.CAMPS)}
        />
        <TabButton
          title={TABS.DONATIONS}
          isActive={activeTab === TABS.DONATIONS}
          onClick={() => setActiveTab(TABS.DONATIONS)}
        />
        <TabButton
          title={TABS.STORIES}
          isActive={activeTab === TABS.STORIES}
          onClick={() => setActiveTab(TABS.STORIES)}
        />
      </div>

      <div>
        {renderTabContent()}
      </div>
    </div>
  );
}

export default AdminDashboard;