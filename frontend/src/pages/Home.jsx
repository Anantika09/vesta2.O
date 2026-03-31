import React, { useEffect, useRef , useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const { width, height, left, top } = heroRef.current.getBoundingClientRect();
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      heroRef.current.style.setProperty('--mouse-x', x);
      heroRef.current.style.setProperty('--mouse-y', y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  const features = [
    {
      icon: '👗',
      title: 'Digital Wardrobe',
      description: 'Upload, organize, and browse all your clothes in one beautiful digital space.',
      stat: '2,345 items',
      statLabel: 'organized',
      link: '/wardrobe',
      gradient: 'linear-gradient(135deg, #CD2C58, #E06B80)',
      bgLight: 'rgba(205,44,88,0.08)'
    },
    {
      icon: '🎨',
      title: 'Look Planner',
      description: 'Mix and match outfits virtually. Create stunning looks for any occasion.',
      stat: '128 looks',
      statLabel: 'created',
      link: '/planner',
      gradient: 'linear-gradient(135deg, #E06B80, #FFC69D)',
      bgLight: 'rgba(224,107,128,0.08)'
    },
    {
      icon: '🧳',
      title: 'Suitcase Planner',
      description: 'Smart packing lists for your travels. Never forget anything again.',
      stat: '45 trips',
      statLabel: 'planned',
      link: '/suitcase',
      gradient: 'linear-gradient(135deg, #FFC69D, #FFE6D4)',
      bgLight: 'rgba(255,198,157,0.08)'
    },
    {
      icon: '📝',
      title: 'Style Notes',
      description: 'Capture ideas, shopping lists, and fashion inspiration instantly.',
      stat: '87 notes',
      statLabel: 'saved',
      link: '/notes',
      gradient: 'linear-gradient(135deg, #CD2C58, #FFC69D)',
      bgLight: 'rgba(205,44,88,0.08)'
    },
    {
      icon: '📅',
      title: 'Outfit History',
      description: 'Track your style journey. Know what you wore and when.',
      stat: '342 wears',
      statLabel: 'recorded',
      link: '/history',
      gradient: 'linear-gradient(135deg, #E06B80, #FFE6D4)',
      bgLight: 'rgba(224,107,128,0.08)'
    },
    {
      icon: '🔍',
      title: 'Style Discovery',
      description: 'Explore thousands of looks from bridal to corporate, worldwide.',
      stat: '5k+ looks',
      statLabel: 'available',
      link: '/explore',
      gradient: 'linear-gradient(135deg, #FFC69D, #FFE6D4)',
      bgLight: 'rgba(255,198,157,0.08)'
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className="hero-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        
        <div className="hero-glow"></div>
        
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content reveal">
              <div className="hero-badge">
                <span className="badge-icon">✨</span>
                <span>AI-Powered Style Assistant</span>
              </div>
              
              <h1 className="hero-title">
                Your Digital
                <span className="hero-title-gradient"> Wardrobe</span>
                <span className="hero-title-outline">Reimagined</span>
              </h1>
              
              <p className="hero-description">
                Upload your clothes. Organize by category. Plan looks. Pack for trips.
                <span className="hero-description-highlight"> Everything in one place.</span>
              </p>
              
              <div className="hero-stats">
                <div className="hero-stat">
                  <span className="hero-stat-number">10,000+</span>
                  <span className="hero-stat-label">Items Organized</span>
                </div>
                <div className="hero-stat-divider"></div>
                <div className="hero-stat">
                  <span className="hero-stat-number">500+</span>
                  <span className="hero-stat-label">Trips Planned</span>
                </div>
                <div className="hero-stat-divider"></div>
                <div className="hero-stat">
                  <span className="hero-stat-number">98%</span>
                  <span className="hero-stat-label">Satisfaction Rate</span>
                </div>
              </div>
              
              <div className="hero-actions">
                <button className="btn-primary" onClick={() => navigate('/register')}>
                  <span>Start Free</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
                <button className="btn-secondary" onClick={() => navigate('/explore')}>
                  <span>Discover Styles</span>
                </button>
              </div>
              
              <div className="hero-trust">
                <div className="trust-avatars">
                  <img src="https://randomuser.me/api/portraits/women/1.jpg" alt="User" />
                  <img src="https://randomuser.me/api/portraits/men/2.jpg" alt="User" />
                  <img src="https://randomuser.me/api/portraits/women/3.jpg" alt="User" />
                  <img src="https://randomuser.me/api/portraits/men/4.jpg" alt="User" />
                  <div className="trust-count">+5k</div>
                </div>
                <p>Join 5,000+ style enthusiasts</p>
              </div>
            </div>
            
            <div className="hero-visual reveal">
              <div className="visual-container">
                <div className="visual-card">
                  <div className="visual-card-inner">
                    <div className="visual-image"></div>
                    <div className="visual-overlay"></div>
                    
                    <div className="floating-element element-1">
                      <div className="floating-icon">👗</div>
                      <div className="floating-info">
                        <span>Your Wardrobe</span>
                        <strong>120 items</strong>
                      </div>
                    </div>
                    
                    <div className="floating-element element-2">
                      <div className="floating-icon">✈️</div>
                      <div className="floating-info">
                        <span>Next Trip</span>
                        <strong>Goa - 5 days</strong>
                      </div>
                    </div>
                    
                    <div className="floating-element element-3">
                      <div className="floating-icon">📦</div>
                      <div className="floating-info">
                        <span>Packing List</span>
                        <strong>12 items packed</strong>
                      </div>
                    </div>
                    
                    <div className="visual-stats">
                      <div className="visual-stat">
                        <span className="visual-stat-number">234</span>
                        <span className="visual-stat-label">Outfits Created</span>
                      </div>
                      <div className="visual-stat">
                        <span className="visual-stat-number">87%</span>
                        <span className="visual-stat-label">Less Shopping</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hero-scroll">
          <span>Scroll to explore</span>
          <div className="scroll-indicator"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header reveal">
            <div className="section-badge">Everything You Need</div>
            <h2 className="section-title">
              All in One Place<span className="gradient-text">One Place</span>
            </h2>
            <p className="section-description">
              From organizing your wardrobe to planning your next adventure
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card reveal"
                style={{ transitionDelay: `${index * 0.05}s` }}
                onClick={() => navigate(feature.link)}
              >
                <div className="feature-card-inner">
                  <div className="feature-icon" style={{ background: feature.bgLight }}>
                    <span style={{ background: feature.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {feature.icon}
                    </span>
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                  <div className="feature-meta">
                    <div className="feature-stat">
                      <span className="feature-stat-number">{feature.stat}</span>
                      <span className="feature-stat-label">{feature.statLabel}</span>
                    </div>
                    <div className="feature-link">
                      <span>Explore</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process">
        <div className="container">
          <div className="section-header reveal">
            <div className="section-badge">Simple Process</div>
            <h2 className="section-title">
              How It Works<span className="gradient-text">Works</span>
            </h2>
            <p className="section-description">Three simple steps to organize your style</p>
          </div>

          <div className="process-steps">
            <div className="process-step reveal">
              <div className="step-number">01</div>
              <div className="step-icon-wrapper">
                <div className="step-icon">📸</div>
              </div>
              <h3>Upload</h3>
              <p>Snap photos of your clothes. Add them to your digital wardrobe.</p>
            </div>
            
            <div className="process-step reveal">
              <div className="step-number">02</div>
              <div className="step-icon-wrapper">
                <div className="step-icon">📁</div>
              </div>
              <h3>Organize</h3>
              <p>Categorize by type, season, occasion. Everything easy to find.</p>
            </div>
            
            <div className="process-step reveal">
              <div className="step-number">03</div>
              <div className="step-icon-wrapper">
                <div className="step-icon">✨</div>
              </div>
              <h3>Plan</h3>
              <p>Create outfits, plan looks, pack for trips with confidence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Travel Feature */}
      <section className="travel">
        <div className="container">
          <div className="travel-card reveal">
            <div className="travel-badge">✈️ For Travel Lovers</div>
            <h2>Pack Smarter, Not Harder</h2>
            <p>Create trips, add items from your wardrobe, and check them off as you pack. Perfect for frequent travelers who never want to forget anything.</p>
            <button className="travel-btn" onClick={() => navigate('/suitcase')}>
              Plan Your Next Trip
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <div className="travel-stats">
              <div className="travel-stat">
                <span className="travel-stat-number">500+</span>
                <span>Trips Planned</span>
              </div>
              <div className="travel-stat">
                <span className="travel-stat-number">100%</span>
                <span>Never Forget</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Section */}
      <section className="sustainable">
        <div className="container">
          <div className="sustainable-card reveal">
            <div className="sustainable-icon">🌱</div>
            <h2>Sustainable Choice</h2>
            <p>Know what you own. Wear what you have. No overbuying. No waste.</p>
            <div className="sustainable-features">
              <div className="sustainable-feature">
                <span>✓</span>
                <span>Privacy First — No ads, no data sharing</span>
              </div>
              <div className="sustainable-feature">
                <span>✓</span>
                <span>Use what you own — Stop buying duplicates</span>
              </div>
              <div className="sustainable-feature">
                <span>✓</span>
                <span>Track your style — See what you actually wear</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-card reveal">
            <h2>Ready to Transform Your Wardrobe?</h2>
            <p>Join thousands of users who never have a 'bad outfit day' anymore.</p>
            <button className="cta-btn" onClick={() => navigate('/register')}>
              Start Your Style Journey
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;