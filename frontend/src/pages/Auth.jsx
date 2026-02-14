import React, { useState } from 'react';
import './Auth.css'; // We’ll move styles to a separate CSS file

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regSkin, setRegSkin] = useState('Fair');
  const [regBody, setRegBody] = useState('Hourglass');
  const [error, setError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Implement login logic here
    // For now, show a success message
    alert('Login successful!');
    // Redirect or update state as needed
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    // Implement registration logic here
    // For now, show a success message
    alert('Registration successful!');
    // Redirect or update state as needed
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="form-toggle">
          <button
            id="loginTab"
            className={isLogin ? 'active' : ''}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            id="regTab"
            className={!isLogin ? 'active' : ''}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {isLogin ? (
          <form id="loginForm" className="auth-form" onSubmit={handleLoginSubmit}>
            <h2>Welcome Back</h2>
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              required
            />
            <button type="submit" className="btn-main">Enter Vesta</button>
          </form>
        ) : (
          <form id="regForm" className="auth-form" onSubmit={handleRegisterSubmit}>
            <h2>Join Vesta</h2>
            <input
              type="text"
              placeholder="Full Name"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={regPass}
              onChange={(e) => setRegPass(e.target.value)}
              required
            />
            <p className="label">Select Style Profile:</p>
            <div className="profile-grid">
              <select value={regSkin} onChange={(e) => setRegSkin(e.target.value)}>
                <option value="Fair">Fair Skin</option>
                <option value="Olive">Olive Skin</option>
                <option value="Medium">Medium Skin</option>
                <option value="Deep">Deep Skin</option>
              </select>
              <select value={regBody} onChange={(e) => setRegBody(e.target.value)}>
                <option value="Hourglass">Hourglass</option>
                <option value="Pear">Pear Shape</option>
                <option value="Rectangle">Rectangle</option>
              </select>
            </div>
            <button type="submit" className="btn-main">Create Profile</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
