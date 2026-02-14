import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';  // Create this CSS file next

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        VESTA
      </Link>
      
      {/* Always visible main links */}
      <div className="navbar-links">
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
      </div>

      {/* Auth section - conditional */}
      <div className="navbar-auth">
        {token ? (
          <>
            <Link to="/wardrobe" className="nav-link">Wardrobe</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/register" className="register-btn">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
