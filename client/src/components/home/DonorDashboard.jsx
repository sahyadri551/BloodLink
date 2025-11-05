import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import "./DonorDashboard.css";

export default function DonorDashboard() {
  const { currentUser } = useAuth();

  return (
    <div className="donor-root">
      <header className="donor-header">
        <div className="donor-container donor-header-grid">
          <div>
            <h1 className="donor-title">
              Welcome back,{" "}
              <span className="highlight">
                {currentUser.username || currentUser.name}
              </span>
              !
            </h1>
            <p className="donor-sub">
              Great to see you again. Here’s a quick look at your impact and
              what you can do next.
            </p>
          </div>
          <div className="donor-badge">
            🩸 Lifesaver Level{" "}
            <strong>{currentUser.donationCount >= 10 ? "Elite" : "Rising"}</strong>
          </div>
        </div>
      </header>

      <main className="donor-container">
        {/* --- STATS CARDS --- */}
        <section className="stats-grid">
          <div className="stat-card stat-red">
            <div className="stat-icon">🩸</div>
            <div className="stat-info">
              <h3>{currentUser.donationCount || 0}</h3>
              <p>Blood Donations</p>
            </div>
          </div>
          <div className="stat-card stat-blue">
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <h3>{currentUser.badges?.length || 0}</h3>
              <p>Badges Earned</p>
            </div>
          </div>
          <div className="stat-card stat-green">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>₹{currentUser.totalDonated || 0}</h3>
              <p>Total Donated</p>
            </div>
          </div>
        </section>

        {/* --- QUICK LINKS --- */}
        <section className="quick-links">
          <h2 className="section-title">Quick Actions</h2>
          <div className="link-grid">
            <Link to="/profile" className="link-card">
              <div className="link-icon">👤</div>
              <div>
                <h3>My Profile</h3>
                <p>Update info, view badges, and donation history.</p>
              </div>
            </Link>
            <Link to="/find-donation" className="link-card">
              <div className="link-icon">🧭</div>
              <div>
                <h3>Find Donation</h3>
                <p>Locate camps or hospitals near you.</p>
              </div>
            </Link>
            <Link to="/request-blood" className="link-card link-accent">
              <div className="link-icon">🚨</div>
              <div>
                <h3>Request Blood</h3>
                <p>Post an urgent blood request instantly.</p>
              </div>
            </Link>
          </div>
        </section>

        {/* --- IMPACT SECTION --- */}
        <section className="impact">
          <h2 className="section-title">Your Impact</h2>
          <p className="impact-text">
            Your donations have helped <strong>{(currentUser.donationCount || 0) * 3}</strong> people get the blood they needed.
            Keep saving lives — every drop matters.
          </p>
          <Link to="/find-donation" className="impact-btn">
            DONATE AGAIN
          </Link>
        </section>
      </main>
    </div>
  );
}
