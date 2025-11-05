import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import "./HospitalDashboard.css";

export default function HospitalDashboard() {
  const { currentUser } = useAuth();

  const isVerified = currentUser.isVerified;

  return (
    <div className="hospital-root">
      {/* HEADER */}
      <header className="hospital-header">
        <div className="hospital-container hospital-header-grid">
          <div>
            <h1 className="hospital-title">
              Welcome,{" "}
              <span className="highlight">
                {currentUser.name || currentUser.username}
              </span>
              !
            </h1>
            <p className="hospital-sub">
              Manage your hospital’s blood activities and connect with donors in
              real-time.
            </p>
          </div>

          <div
            className={`status-pill ${
              isVerified ? "verified" : "pending"
            }`}
          >
            {isVerified ? "✅ Verified Hospital" : "⏳ Pending Approval"}
          </div>
        </div>
      </header>

      <main className="hospital-container">
        {/* VERIFICATION NOTICE */}
        {!isVerified && (
          <div className="alert alert-warning">
            <h2>Your Account is Pending Approval</h2>
            <p>
              An admin is reviewing your registration. Once approved, you’ll be
              able to post camps and confirm donations.
            </p>
          </div>
        )}

        {/* QUICK STATS */}
        <section className="stats-grid">
          <div className="stat-card stat-red">
            <div className="stat-icon">🩸</div>
            <div className="stat-info">
              <h3>{currentUser.totalRequests || 0}</h3>
              <p>Blood Requests Posted</p>
            </div>
          </div>
          <div className="stat-card stat-green">
            <div className="stat-icon">🏥</div>
            <div className="stat-info">
              <h3>{currentUser.campsHosted || 0}</h3>
              <p>Camps Organized</p>
            </div>
          </div>
          <div className="stat-card stat-blue">
            <div className="stat-icon">💉</div>
            <div className="stat-info">
              <h3>{currentUser.donationsConfirmed || 0}</h3>
              <p>Donations Confirmed</p>
            </div>
          </div>
        </section>

        {/* ACTION TOOLS */}
        <section className="tools">
          <h2 className="section-title">Hospital Tools</h2>
          <div className="tool-grid">
            <Link to="/profile" className="tool-card">
              <div className="tool-icon">👤</div>
              <div>
                <h3>My Profile</h3>
                <p>Update your hospital’s details and contact info.</p>
              </div>
            </Link>

            <Link
              to="/create-camp"
              className={`tool-card ${
                !isVerified ? "disabled" : "accent"
              }`}
            >
              <div className="tool-icon">📢</div>
              <div>
                <h3>Create Blood Camp</h3>
                <p>Post a new donation drive and invite donors.</p>
              </div>
            </Link>

            <Link
              to="/confirm-donation"
              className={`tool-card ${
                !isVerified ? "disabled" : "success"
              }`}
            >
              <div className="tool-icon">✅</div>
              <div>
                <h3>Confirm Donation</h3>
                <p>Verify donor participation and award badges.</p>
              </div>
            </Link>
          </div>
        </section>

        {/* COMMUNITY IMPACT */}
        <section className="impact">
          <h2 className="section-title">Your Impact</h2>
          <p className="impact-text">
            Together with your donors, you’ve helped save{" "}
            <strong>{(currentUser.donationsConfirmed || 0) * 3}</strong> lives
            so far.
          </p>
          <Link to="/create-camp" className="impact-btn">
            ORGANIZE NEW CAMP
          </Link>
        </section>
      </main>
    </div>
  );
}
