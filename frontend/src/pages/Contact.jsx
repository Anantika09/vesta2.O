import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import api from '../utils/api';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('All fields are required');
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.sendContact(formData);
      if (response.status === 'success') {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 5000);
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: '📧', title: 'Email', details: ['vesta.helpus@gmail.com', 'vesta.supportus@gmail.com'] },
    { icon: '📍', title: 'Location', details: ['GLA University', 'Mathura, Uttar Pradesh', 'India'] },
    { icon: '📞', title: 'Phone', details: ['+91 73009 64601'] }
  ];

  return (
    <div className="contact-page">
      <PageHeader 
        title="Get in Touch" 
        subtitle="Have questions about Vesta? We'd love to hear from you." 
      />

      <div className="contact-container">
        <div className="contact-grid">
          {/* Left Column - Contact Info */}
          <div className="contact-info">
            {contactInfo.map((info, index) => (
              <div key={index} className="info-card">
                <div className="info-icon">{info.icon}</div>
                <div className="info-content">
                  <h3>{info.title}</h3>
                  {info.details.map((detail, i) => (
                    info.title === 'Email' ? (
                      <a key={i} href={`mailto:${detail}`} className="info-detail">{detail}</a>
                    ) : info.title === 'Phone' ? (
                      <a key={i} href={`tel:${detail.replace(/\s/g, '')}`} className="info-detail">{detail}</a>
                    ) : (
                      <p key={i} className="info-detail">{detail}</p>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Contact Form */}
          <div className="contact-form-section">
            <div className="form-card">
              <h2>Send us a message</h2>
              <p>We'll get back to you within 24 hours</p>
              
              {isSubmitted ? (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  {error && (
                    <div className="error-message">
                      <span>!</span>
                      <span>{error}</span>
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label htmlFor="name">Your name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="hello@vesta.style"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Your message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      rows="5"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
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