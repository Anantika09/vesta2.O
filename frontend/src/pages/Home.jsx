import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.slide-in, .fade-up, .scale-in').forEach(el => observer.observe(el));
    
    // Parallax effect on scroll
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const hero = document.querySelector('.hero-visual');
      if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.1}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Your local images with exact filenames
  const heroImages = {
    glam: "/images/hero/outfit-glam.jpg",
    casual: "/images/hero/outfit-casual.jpg",
    party: "/images/hero/outfit-party.jpg",
    bridal: "/images/hero/outfit-bridal.jpg"
  };

  const showcaseImages = {
    top: "/images/showcase/outfit1.jpg",
    jeans: "/images/showcase/outfit2.jpg",
    accessories: "/images/showcase/outfit3.jpg",
    final: "/images/showcase/outfit4.jpg"
  };

  const avatarImages = [
    "/images/avatars/avatar1.jpg",
    "/images/avatars/avatar2.jpg",
    "/images/avatars/avatar3.jpg"
  ];

  const inspirationImages = [
    { category: "Bridal Looks", count: "2.5k+", color: "#CD2C58", image: "/images/hero/outfit-bridal.jpg" },
    { category: "Festive Wear", count: "1.8k+", color: "#E06B80", image: "/images/hero/outfit-glam.jpg" },
    { category: "Casual Chic", count: "3.2k+", color: "#FFC69D", image: "/images/hero/outfit-casual.jpg" },
    { category: "Party Glam", count: "1.2k+", color: "#FFE6D4", image: "/images/hero/outfit-party.jpg" }
  ];

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-pattern"></div>
        <div className="container hero-container">
          <div className="hero-content slide-in">
            <div className="hero-badge">
              <span className="badge-pulse"></span>
              AI-POWERED STYLING
            </div>
            <h1 className="hero-title">
              Your Personal
              <span className="gradient-text"> Style Intelligence</span>
            </h1>
            <p className="hero-subtitle">
              Stop scrolling. Start styling. Vesta analyzes your wardrobe, body type, 
              and preferences to deliver <span className="highlight">cinematic outfit recommendations</span> 
              that actually make sense.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Looks Generated</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">98%</span>
                <span className="stat-label">Satisfaction</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">15min</span>
                <span className="stat-label">Avg. Setup</span>
              </div>
            </div>
            <div className="hero-cta">
              <button className="btn-primary" onClick={() => navigate('/register')}>
                Start Your Style Journey
                <i className="ri-arrow-right-line"></i>
              </button>
              <button className="btn-outline" onClick={() => navigate('/explore')}>
                See Inspiration
              </button>
            </div>
            <div className="hero-testimonial">
              <div className="testimonial-avatars">
                {avatarImages.map((avatar, index) => (
                  <img key={index} src={avatar} alt="user" />
                ))}
              </div>
              <p>Join 5,000+ fashion enthusiasts</p>
            </div>
          </div>

          <div className="hero-visual scale-in">
            <div className="floating-card card-1">
              <div className="card-icon" style={{background: '#CD2C58'}}>👗</div>
              <div className="card-content">
                <h4>Today's Pick</h4>
                <p>Summer Elegance</p>
              </div>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon" style={{background: '#E06B80'}}>💄</div>
              <div className="card-content">
                <h4>Makeup Match</h4>
                <p>Nude Glow</p>
              </div>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon" style={{background: '#FFC69D'}}>👠</div>
              <div className="card-content">
                <h4>Accessory</h4>
                <p>Gold Statement</p>
              </div>
            </div>
            <div className="hero-image-grid">
              <div className="grid-item item-1" style={{backgroundImage: `url(${heroImages.glam})`}}>
                <div className="image-overlay"></div>
                <span className="image-label">Glam</span>
              </div>
              <div className="grid-item item-2" style={{backgroundImage: `url(${heroImages.casual})`}}>
                <div className="image-overlay"></div>
                <span className="image-label">Casual</span>
              </div>
              <div className="grid-item item-3" style={{backgroundImage: `url(${heroImages.party})`}}>
                <div className="image-overlay"></div>
                <span className="image-label">Party</span>
              </div>
              <div className="grid-item item-4" style={{backgroundImage: `url(${heroImages.bridal})`}}>
                <div className="image-overlay"></div>
                <span className="image-label">Bridal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW VESTA WORKS */}
      <section className="process-section">
        <div className="container">
          <div className="section-header text-center fade-up">
            <span className="section-subtitle">THE METHOD</span>
            <h2 className="section-title">Three Steps to <span className="gradient-text">Perfect Style</span></h2>
            <p className="section-description">
              No more guesswork. No more endless scrolling. Just your personal styling assistant.
            </p>
          </div>

          <div className="process-grid">
            {[
              {
                num: "01",
                title: "Upload & Archive",
                desc: "Snap photos of your clothes. Vesta builds your digital wardrobe automatically.",
                features: ["AI Tagging", "Color Analysis", "Season Sorting"]
              },
              {
                num: "02",
                title: "Discover Your Style DNA",
                desc: "Our AI analyzes your body type, skin tone, and preferences.",
                features: ["Body Shape Match", "Tone Harmony", "Trend Alignment"]
              },
              {
                num: "03",
                title: "Get Cinematic Looks",
                desc: "Receive Instagram-worthy outfit combinations tailored to any occasion.",
                features: ["Event Based", "Weather Aware", "Mix & Match"]
              }
            ].map((item, i) => (
              <div key={i} className="process-card slide-in" style={{animationDelay: `${i * 0.2}s`}}>
                <div className="process-number">{item.num}</div>
                <h3>{item.title}</h3>
                <p className="process-desc">{item.desc}</p>
                <ul className="process-features">
                  {item.features.map((feature, idx) => (
                    <li key={idx}>
                      <i className="ri-check-line"></i> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE SHOWCASE */}
      <section className="feature-showcase">
        <div className="container">
          <div className="showcase-grid">
            <div className="showcase-content fade-up">
              <span className="feature-tag">✨ NEW</span>
              <h2>Visual Search. <span className="gradient-text">Instant Results.</span></h2>
              <p>Upload any outfit photo and watch Vesta find matching pieces from your wardrobe or suggest similar styles from our inspiration database.</p>
              
              <div className="feature-list">
                {[
                  "Upload top → Get bottom suggestions",
                  "Screenshot a celebrity → Find similar items",
                  "Mix two outfits → AI generates fusion look"
                ].map((item, i) => (
                  <div key={i} className="feature-item">
                    <i className="ri-camera-line" style={{color: '#CD2C58'}}></i>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              
              <button className="btn-secondary" onClick={() => navigate('/wardrobe')}>
                Explore Visual Search
                <i className="ri-arrow-right-line"></i>
              </button>
            </div>
            
            <div className="showcase-visual scale-in">
              <div className="visual-grid">
                <div className="visual-item" style={{backgroundImage: `url(${showcaseImages.top})`}}>
                  <span className="visual-tag">Your Top</span>
                </div>
                <div className="visual-item" style={{backgroundImage: `url(${showcaseImages.jeans})`}}>
                  <span className="visual-tag">Suggested Jeans</span>
                </div>
                <div className="visual-item" style={{backgroundImage: `url(${showcaseImages.accessories})`}}>
                  <span className="visual-tag">Accessories</span>
                </div>
                <div className="visual-item" style={{backgroundImage: `url(${showcaseImages.final})`}}>
                  <span className="visual-tag">Final Look</span>
                </div>
              </div>
              <div className="visual-overlay"></div>
            </div>
          </div>
        </div>
      </section>

      {/* INSPIRATION SNIPPET */}
      <section className="inspiration-snippet">
        <div className="container">
          <div className="snippet-header text-center fade-up">
            <h2>From 'What do I wear?' to <span className="gradient-text">'Wow, that's me'</span></h2>
          </div>
          
          <div className="inspiration-grid">
            {inspirationImages.map((item, i) => (
              <div key={i} className="inspiration-card scale-in" style={{animationDelay: `${i * 0.1}s`}}>
                <div className="card-image" style={{backgroundImage: `url(${item.image})`}}>
                  <div className="card-overlay" style={{background: `linear-gradient(135deg, ${item.color}80, transparent)`}}></div>
                </div>
                <h3>{item.category}</h3>
                <p>{item.count} curated looks</p>
                <button className="card-btn">
                  <i className="ri-arrow-right-line"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content fade-up">
            <h2>Ready to revolutionize your wardrobe?</h2>
            <p>Join thousands of users who never have a 'bad outfit day' anymore.</p>
            <button className="btn-primary btn-large" onClick={() => navigate('/register')}>
              Create Your Style Profile
              <i className="ri-sparkling-line"></i>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;