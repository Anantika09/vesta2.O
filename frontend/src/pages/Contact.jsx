import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 1500);
  };

  return (
    <div className="contact-page">
      {/* Simple Background */}
      <div className="contact-bg"></div>

      <div className="contact-container">
        {/* Header */}
        <div className="contact-header">
          <span className="contact-tag">CONTACT</span>
          <h1 className="contact-title">Get in touch</h1>
          <p className="contact-subtitle">
            Have questions about Vesta? We'd love to hear from you.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="contact-grid">
          {/* Left Column - Info */}
          <div className="contact-info">
            <div className="info-card">
              <h2 className="info-title">Email us</h2>
              <a href="mailto:hello@vesta.style" className="info-email">hello@vesta.style</a>
              <a href="mailto:support@vesta.style" className="info-email">support@vesta.style</a>
            </div>

            <div className="info-card">
              <h2 className="info-title">Visit us</h2>
              <p className="info-address">
                GLA University<br />
                Mathura, Uttar Pradesh<br />
                India
              </p>
            </div>

            <div className="info-card">
              <h2 className="info-title">Call us</h2>
              <a href="tel:+919105188751" className="info-phone">+91 91051 88751</a>
            </div>

            <div className="info-card">
              <h2 className="info-title">Follow us</h2>
              <div className="social-links">
                <a href="#" className="social-link">Instagram</a>
                <a href="#" className="social-link">Twitter</a>
                <a href="#" className="social-link">LinkedIn</a>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="contact-form-col">
            <div className="form-card">
              <h2 className="form-card-title">Send a message</h2>
              
              {isSubmitted ? (
                <div className="success-message">
                  <span className="success-icon">✓</span>
                  <p>Thank you! We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Your name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-input"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-input"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message" className="form-label">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      className="form-input form-textarea"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;