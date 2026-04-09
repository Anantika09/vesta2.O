import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://vesta-wfcf.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      
      console.log('Login successful! Token stored');
      
      // Force redirect to home
      window.location.href = '/';
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
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
            <h1>Welcome Back</h1>
            <p>Sign in to continue your style journey</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            <div className="login-options">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="remember-text">Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
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

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>

            
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        <div className="feature-sidebar animate-slide-up">
          <h3>Welcome back to Vesta</h3>
          
          <div className="welcome-message">
            <p>Your personal style assistant is ready to help you:</p>
          </div>

          <ul className="feature-list">
            <li className="feature-item">
              <span className="feature-icon">👗</span>
              <div>
                <strong>Your Digital Wardrobe</strong>
                <p>Store all your clothes, footwear, accessories</p>
              </div>
            </li>
            <li className="feature-item">
              <span className="feature-icon">✨</span>
              <div>
                <strong>Look Planner</strong>
                <p>Mix and match outfits virtually</p>
              </div>
            </li>
            <li className="feature-item">
              <span className="feature-icon">📸</span>
              <div>
                <strong>Suitcase Planner</strong>
                <p>Smart packing lists for travel</p>
              </div>
            </li>
            <li className="feature-item">
              <span className="feature-icon">🎯</span>
              <div>
                <strong>Style Notes</strong>
                <p>Save ideas, shopping lists, inspiration</p>
              </div>
            </li>
          </ul>

          <div className="testimonial-card">
            <div className="quote-mark">"</div>
            <p>"I've saved hours of outfit planning. Vesta is a game-changer!"</p>
            <div className="testimonial-author">
              <div className="author-avatar">M</div>
              <div>
                <strong>Garima Saxena</strong>
                <span>Member since 2025</span>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Daily Users</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Outfits</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Satisfaction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;