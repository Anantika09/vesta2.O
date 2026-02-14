import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "Anantika Sharma",
    email: "anantika@example.com",
    location: "New Delhi, India",
    joinDate: "January 15, 2024",
    stylePersonality: "Creative Explorer",
    fashionGoals: "Build versatile capsule wardrobe",
    stats: {
      wardrobeItems: 42,
      savedLooks: 18,
      eventsPlanned: 5,
      styleScore: 92,
    },
  });

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo">
            VESTA
          </Link>

          <div className="nav-menu">
            <Link to="/" className="nav-link">
              Dashboard
            </Link>
            <Link to="/wardrobe" className="nav-link">
              My Wardrobe
            </Link>
            <Link to="/recommendations" className="nav-link">
              Recommendations
            </Link>
            <Link to="/events" className="nav-link">
              Events
            </Link>
          </div>

          <Link to="/profile" className="nav-link active">
            {profileData.name.split(" ")[0]}
          </Link>
        </div>
      </nav>

      {/* Profile Page */}
      <main className="profile-page">
        <div className="page-header-profile">
          <h1 className="hero-title">
            My <span className="gradient-text">Style Profile</span>
          </h1>
          <p className="page-subtitle">
            Your personal style preferences and saved items
          </p>
        </div>

        {/* Profile Header */}
        <section className="profile-header">
          <div className="profile-avatar">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb"
              alt="Profile"
              className="avatar-image"
            />
          </div>

          <div className="profile-info">
            <h1 className="profile-name">{profileData.name}</h1>
            <div className="profile-title">
              Fashion Enthusiast • BTech CS Student
            </div>

            <div className="profile-stats">
              <div className="stat-item-profile">
                <span className="stat-number-profile">
                  {profileData.stats.wardrobeItems}
                </span>
                <span className="stat-label">Wardrobe Items</span>
              </div>

              <div className="stat-item-profile">
                <span className="stat-number-profile">
                  {profileData.stats.savedLooks}
                </span>
                <span className="stat-label">Saved Looks</span>
              </div>

              <div className="stat-item-profile">
                <span className="stat-number-profile">
                  {profileData.stats.eventsPlanned}
                </span>
                <span className="stat-label">Events Planned</span>
              </div>

              <div className="stat-item-profile">
                <span className="stat-number-profile">
                  {profileData.stats.styleScore}
                </span>
                <span className="stat-label">Style Score</span>
              </div>
            </div>
          </div>
        </section>

        {/* Personal Info Card */}
        <section className="profile-card">
          <div className="card-header">
            <h3 className="card-title">Personal Information</h3>
          </div>

          <div className="personal-grid">
            <div>
              <span className="measurement-label">Full Name</span>
              <span className="measurement-value">
                {profileData.name}
              </span>
            </div>

            <div>
              <span className="measurement-label">Email</span>
              <span className="measurement-value">
                {profileData.email}
              </span>
            </div>

            <div>
              <span className="measurement-label">Location</span>
              <span className="measurement-value">
                {profileData.location}
              </span>
            </div>

            <div>
              <span className="measurement-label">Member Since</span>
              <span className="measurement-value">
                {profileData.joinDate}
              </span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Profile;
