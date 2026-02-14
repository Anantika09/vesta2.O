import React, { useState } from 'react';
import './Contact.css'; // We’ll move styles to a separate CSS file

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your contact form logic here
    // For now, we'll show a success message
    alert('Message sent successfully! 🎉 We will get back to you soon.');
    setName('');
    setEmail('');
    setMessage('');
    setStatus(''); // Reset status after submission
  };

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

      <div className="contact-container">
        <div className="contact-info">
          <h2>Let's Talk Style</h2>
          <p>Have questions about how Vesta works or want to suggest a feature? Drop us a message.</p>
          <div className="info-item">📍 Agra, Uttar Pradesh</div>
          <div className="info-item">📧 support@vestastyle.com</div>
        </div>

        <form id="contactForm" className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            placeholder="How can we help?"
            rows="5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
          <button type="submit" className="btn-main">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
