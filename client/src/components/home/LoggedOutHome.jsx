import React from "react";
import { Link } from "react-router-dom";
import {
  BuildingOfficeIcon,
  BeakerIcon,
  GlobeAltIcon,
  MapIcon,
} from "@heroicons/react/24/outline";

import "./LoggedOutHome.css";

import phoneMockup from "../../assets/phone-mockup.png";
import googlePlayBtn from "../../assets/google-play.png";
import aimDigital from "../../assets/aim-digital.png";
import aimPromote from "../../assets/aim-promote.png";
import aimAwareness from "../../assets/aim-awareness.png";
import aimEcosystem from "../../assets/aim-ecosystem.png";
import benefitsHero from "../../assets/benefits-hero.png";
import compatibilityChart from "../../assets/compatibility-chart.png";

function FeatureLink({ to, icon, title }) {
  return (
    <Link to={to} className="loh-feature">
      <div className="loh-feature-icon">{icon}</div>
      <div className="loh-feature-title">{title}</div>
    </Link>
  );
}

export default function LoggedOutHome() {
  const aims = [
    { img: aimDigital, title: "Digitalize Blood Management" },
    { img: aimPromote, title: "Promote Ease of Donation" },
    { img: aimAwareness, title: "Spread Blood Donation Awareness" },
    { img: aimEcosystem, title: "Build a Sustainable Ecosystem" },
  ];

  return (
    <div className="loh-root">
      {/* HERO */}
      <section className="loh-hero">
        <div className="loh-container loh-hero-grid">
          <div>
            <h1 className="loh-hero-title">
              Donate Blood &amp; Save Lives with <span>BloodLink</span>
            </h1>
            <p className="loh-hero-sub">
              Connecting donors, hospitals, and blood banks to make life-saving
              donations easier and faster.
            </p>
            <img
              src={googlePlayBtn}
              alt="Get it on Google Play"
              className="loh-google-btn"
            />
          </div>

          <div className="loh-hero-image-wrap">
            <img
              src={benefitsHero}
              alt="BloodLink App"
              className="loh-hero-image"
            />
          </div>
        </div>
      </section>

      {/* FIND BAR (overlapping) */}
      <section className="loh-findbar-wrap">
        <div className="loh-findbar loh-container">
          <FeatureLink
            to="/find-donation"
            icon={<BuildingOfficeIcon className="loh-svg" />}
            title="Find Hospital"
          />
          <FeatureLink
            to="/find-donation"
            icon={<GlobeAltIcon className="loh-svg" />}
            title="Find Blood Bank"
          />
          <FeatureLink
            to="/find-donation"
            icon={<BeakerIcon className="loh-svg" />}
            title="Find Lab"
          />
          <FeatureLink
            to="/camps"
            icon={<MapIcon className="loh-svg" />}
            title="Find Blood Camp"
          />
        </div>
      </section>

      {/* JOIN */}
      <section className="loh-join loh-container">
        <h2 className="loh-section-title">Join the Cause</h2>
        <p className="loh-lead">
          Become part of a life-saving mission. Donate blood, help hospitals,
          and make a real difference today.
        </p>
        <div className="loh-cta-row">
          <Link className="loh-btn loh-btn-dark" to="/login">
            LOGIN
          </Link>
          <Link className="loh-btn loh-btn-primary" to="/register">
            REGISTER
          </Link>
        </div>
      </section>

      {/* OUR AIM */}
      <section className="loh-aims">
        <div className="loh-container">
          <h2 className="loh-section-title center">Our Aim</h2>
          <div className="loh-aim-grid">
            {aims.map((a, i) => (
              <div className="loh-aim-card" key={i}>
                <img src={a.img} alt={a.title} className="loh-aim-img" />
                <h3 className="loh-aim-title">{a.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="loh-benefits loh-container">
        <div className="loh-benefits-grid">
          <div className="loh-benefits-image-wrap">
            <img src={phoneMockup} alt="Become a Hero" className="loh-phone" />
          </div>
          <div>
            <h4 className="loh-small-title">Benefits of Blood Donation</h4>
            <h2 className="loh-big-title">Save Lives, Be a Real Hero</h2>
            <p className="loh-paragraph">
              Donating blood isn’t just noble — it’s scientifically proven to
              improve your health, boost mood, and strengthen your community.
            </p>
            <div className="loh-benefit-lists">
              <ul>
                <li>Reduces Risk of Cancer</li>
                <li>Helps in Weight Loss</li>
                <li>Replenishes Blood</li>
                <li>Lowers Cholesterol</li>
              </ul>
              <ul>
                <li>Boosts Production of RBCs</li>
                <li>Psychologically Rejuvenating</li>
              </ul>
            </div>
            <Link className="loh-btn loh-btn-primary mt-18" to="/eligibility-check">
              EXPLORE MORE
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="loh-faq">
        <div className="loh-container loh-faq-grid">
          <div>
            <h2 className="loh-section-title">Frequently Asked Questions</h2>
            <ol className="loh-faq-list">
              <li>Am I eligible to donate blood?</li>
              <li>What should I do after donating blood?</li>
              <li>How can I use BloodLink to donate blood?</li>
              <li>Where can I find the nearest donation camp?</li>
              <li>How often can I donate blood safely?</li>
            </ol>
          </div>
          <div className="loh-compat-wrap">
            <img
              src={compatibilityChart}
              alt="Blood Compatibility Chart"
              className="loh-compat"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
