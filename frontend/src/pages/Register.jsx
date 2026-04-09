import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const strength = calculatePasswordStrength(formData.password);
    setPasswordStrength(strength);
  }, [formData.password]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]+/)) strength += 25;
    if (password.match(/[A-Z]+/)) strength += 25;
    if (password.match(/[0-9]+/)) strength += 25;
    return strength;
  };

  const getStrengthColor = () => {
    if (passwordStrength < 25) return '#ff4444';
    if (passwordStrength < 50) return '#ffa700';
    if (passwordStrength < 75) return '#ffd700';
    return '#00C851';
  };

  const getStrengthText = () => {
    if (passwordStrength < 25) return 'Very Weak';
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const result = await register({
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      setSuccess('Account created successfully!');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="auth-background">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-shape bg-shape-3"></div>
        <div className="bg-shape bg-shape-4"></div>
        <div className="bg-overlay"></div>
      </div>

      <div className="auth-wrapper" style={{ marginTop: '100px' }}>
        <div className="auth-card animate-slide-up">
          <div className="card-decoration">
            <div className="decoration-circle"></div>
            <div className="decoration-line"></div>
          </div>

          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Join the Vesta community and transform your style</p>
          </div>

          {success && (
            <div className="success-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="input-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="form-input"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <span className="input-icon">👤</span>
              </div>

              <div className="input-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="form-input"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                <span className="input-icon">👤</span>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <span className="input-icon">📧</span>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill"
                      style={{ 
                        width: `${passwordStrength}%`,
                        backgroundColor: getStrengthColor()
                      }}
                    />
                  </div>
                  <span className="strength-text" style={{ color: getStrengthColor() }}>
                    {getStrengthText()}
                  </span>
                </div>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span className="input-icon">✓</span>
            </div>

            {error && (
              <div className="error-message">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Feature Sidebar - Restored */}
        <div className="feature-sidebar animate-slide-up" style={{animationDelay: '0.2s'}}>
          <h3>What You Can Do</h3>
          <ul className="feature-list">
            <li className="feature-item">
              <span className="feature-icon">👗</span>
              <div>
                <strong>Digital Wardrobe</strong>
                <p>Store all your clothes, footwear, accessories</p>
              </div>
            </li>
            <li className="feature-item">
              <span className="feature-icon">🎨</span>
              <div>
                <strong>Look Planner</strong>
                <p>Mix and match outfits virtually</p>
              </div>
            </li>
            <li className="feature-item">
              <span className="feature-icon">🧳</span>
              <div>
                <strong>Suitcase Planner</strong>
                <p>Smart packing lists for travel</p>
              </div>
            </li>
            <li className="feature-item">
              <span className="feature-icon">📝</span>
              <div>
                <strong>Style Notes</strong>
                <p>Save ideas, shopping lists, inspiration</p>
              </div>
            </li>
          </ul>
          <div className="testimonial-card">
            <p>"Vesta completely changed how I manage my wardrobe. No more forgotten clothes!"</p>
            <div className="testimonial-author">
              <div className="author-avatar">A</div>
              <div>
                <strong>Anantika Agarwal</strong>
                <span>Creator</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;