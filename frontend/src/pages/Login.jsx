import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Login.css'; // We’ll move styles to a separate CSS file

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      if (response) {
        // Redirect to dashboard or another page
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <nav className="navbar">
        <div className="logo">VESTA</div>
        <a href="/register" className="btn">Create Account</a>
      </nav>

      <div className="auth-card">
        <h1>Welcome Back</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <i className="fas fa-envelope input-icon"></i>
            <input
              type="email"
              className="form-input"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <i className="fas fa-lock input-icon"></i>
            <input
              type="password"
              className="form-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="form-submit">Sign In</button>
        </form>
        {error && <div className="auth-error">{error}</div>}
        <div className="auth-link">
          Don't have an account? <a href="/register">Sign up here</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
