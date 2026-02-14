import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!firstName || !lastName || !email || !password) {
      setError('All fields are required');
      return;
    }
    
    // Save to localStorage (temporary storage)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user exists
    const userExists = users.some(user => user.email === email);
    if (userExists) {
      setError('User already exists');
      return;
    }
    
    // Save new user
    const newUser = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      password // In real app, never store plain passwords!
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Registration successful!');
    window.location.href = '/login';
  };

  return (
    <div className="register-page">
      <nav className="navbar">
        <div className="nav-container">
          <a href="/" className="logo">VESTA</a>
          <a href="/login" className="btn">Sign In</a>
        </div>
      </nav>

      <div className="auth-card">
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              className="form-input"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              className="form-input"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
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
            <input
              type="password"
              className="form-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="form-submit">Create Account</button>
        </form>
        {error && <div className="auth-error">{error}</div>}
        <p style={{ marginTop: '1.5rem', color: 'rgba(255,255,255,0.7)' }}>
          Already have an account? <a href="/login" style={{ color: '#facc15' }}>Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Register;