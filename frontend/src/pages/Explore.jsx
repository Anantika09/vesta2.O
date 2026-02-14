import React from "react";
import { Link } from "react-router-dom";
import "./Explore.css";

const Explore = () => {
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
              Home
            </Link>
            <Link to="/explore" className="nav-link active">
              Explore
            </Link>
            <Link to="/wardrobe" className="nav-link">
              Wardrobe
            </Link>
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
          </div>

          <Link to="/dashboard" className="btn btn-primary">
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Explore Section */}
      <section className="explore-section">
        <div className="container">
          <h1 className="explore-title">Explore Trends</h1>

          <div className="explore-grid">
            <div className="card">
              <h3>Summer Collection</h3>
              <p>Light fabrics and vibrant colors for warm days</p>
            </div>

            <div className="card">
              <h3>Office Wear</h3>
              <p>Professional outfits that make you stand out</p>
            </div>

            <div className="card">
              <h3>Casual Chic</h3>
              <p>Effortless style for everyday elegance</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Explore;
