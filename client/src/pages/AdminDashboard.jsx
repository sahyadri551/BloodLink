import React, { useState } from "react";
import PropTypes from "prop-types";
import HospitalApproval from "../components/admin/HospitalApproval";
import ManageUsers from "../components/admin/ManageUsers";
import ManageCamps from "../components/admin/ManageCamps";
import ManageDonations from "../components/admin/ManageDonations";
import ManageStories from "../components/admin/ManageStories";
import "./AdminDashboard.css";

function TabButton({ title, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`tab-btn ${isActive ? "active" : ""}`}
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
  APPROVAL: "Approvals",
  USERS: "Users",
  CAMPS: "Camps",
  DONATIONS: "Donations",
  STORIES: "Stories",
};

export default function AdminDashboard() {
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

  return (
    <div className="admin-root">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-container">
          <h1 className="admin-title">Admin Dashboard 🩸</h1>
          <p className="admin-sub">
            Oversee hospitals, donors, and the BloodLink network with clarity and control.
          </p>
        </div>
      </header>

      {/* Tab Controls */}
      <div className="admin-container">
        <div className="tabs">
          {Object.values(TABS).map((tab) => (
            <TabButton
              key={tab}
              title={tab}
              isActive={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            />
          ))}
        </div>

        {/* Content */}
        <div className="tab-content fadeIn">{renderTabContent()}</div>
      </div>
    </div>
  );
}
