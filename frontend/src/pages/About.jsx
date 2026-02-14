import React from 'react';
import './About.css'; // We’ll move styles to a separate CSS file

const About = () => {
  return (
    <div>
      <nav className="navbar">
        <div className="nav-container">
          <a href="/" className="logo">
            <i className="fas fa-crown"></i>
            <span>VESTA</span>
          </a>
          <div className="nav-menu">
            <a href="/">Home</a>
            <a href="/explore">Explore</a>
            <a href="/wardrobe">Wardrobe</a>
            <a href="/profile">Profile</a>
          </div>
          <div id="authButtons">
            {/* This can be dynamically populated based on auth state */}
          </div>
        </div>
      </nav>

      <section className="about-hero">
        <h1>Your Style, <span>Decoded.</span></h1>
        <p>Vesta is a visual-first styling engine designed to bridge the gap between your wardrobe and global fashion trends.</p>
      </section>

      <section className="features-grid">
        <div className="feature-card">
          <h3>Metadata Styling</h3>
          <p>Our algorithm uses skin tone and body type metadata to filter the perfect look for you—no complex AI, just pure logic.</p>
        </div>
        <div className="feature-card">
          <h3>Visual Search</h3>
          <p>Say goodbye to long paragraphs. Vesta speaks the language of images, providing instant visual inspiration.</p>
        </div>
        <div className="feature-card">
          <h3>Digital Closet</h3>
          <p>Upload your own items to create a virtual inventory that follows you wherever you go.</p>
        </div>
      </section>
    </div>
  );
};

export default About;
