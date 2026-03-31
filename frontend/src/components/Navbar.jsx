import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/wardrobe', label: 'Wardrobe' },
    { path: '/planner', label: 'Planner' },
    { path: '/suitcase', label: 'Suitcase' },
    { path: '/notes', label: 'Notes' },
    { path: '/history', label: 'History' },
    { path: '/explore', label: 'Explore' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  const userInitial = user?.name?.charAt(0).toUpperCase() || 'U';
  const userName = user?.name?.split(' ')[0] || 'User';

  return (
    <>
    
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
            <span className="logo-text">VESTA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="nav-auth">
            {isAuthenticated ? (
              <div className="user-menu">
                <button 
                  className="user-btn"
                  onClick={() => setActiveDropdown(activeDropdown === 'user' ? null : 'user')}
                >
                  <div className="user-avatar">
                    <span>{userInitial}</span>
                  </div>
                  <span className="user-name">{userName}</span>
                  <svg 
                    className={`dropdown-icon ${activeDropdown === 'user' ? 'open' : ''}`}
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                
                {activeDropdown === 'user' && (
                  <div className="dropdown">
                    <Link to="/profile" className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Profile
                    </Link>
                    <Link to="/wardrobe" className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M3 12h18M3 18h18" />
                      </svg>
                      My Wardrobe
                    </Link>
                    <Link to="/notes" className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      Notes
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item logout">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="login-link">Sign in</Link>
                <Link to="/register" className="register-link">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`mobile-btn ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-container">
          <div className="mobile-nav">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-link ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {isAuthenticated ? (
            <div className="mobile-auth">
              <div className="mobile-user">
                <div className="mobile-avatar">{userInitial}</div>
                <div className="mobile-user-info">
                  <span className="mobile-name">{user?.name}</span>
                  <span className="mobile-email">{user?.email}</span>
                </div>
              </div>
              <button onClick={handleLogout} className="mobile-logout">Logout</button>
            </div>
          ) : (
            <div className="mobile-auth-buttons">
              <Link to="/login" className="mobile-login" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
              <Link to="/register" className="mobile-register" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;