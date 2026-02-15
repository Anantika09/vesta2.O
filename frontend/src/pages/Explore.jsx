import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Explore.css';

const Explore = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up, .scale-in').forEach(el => observer.observe(el));
  }, []);

  const categories = [
    { id: 'all', label: 'All Trends' },
    { id: 'winter', label: 'Winter 2026' },
    { id: 'street', label: 'Streetwear' },
    { id: 'retro', label: 'Retro' },
    { id: 'bridal', label: 'Bridal' },
    { id: 'festive', label: 'Festive' }
  ];

  const collections = [
    {
      id: 1,
      category: 'winter',
      title: 'Minimalist Chic',
      description: 'Clean lines, neutral tones, timeless elegance',
      image: '/images/hero/outfit-glam.jpg',
      color: '#CD2C58',
      trend: 'Winter 2026',
      items: 24,
      season: 'Winter'
    },
    {
      id: 2,
      category: 'street',
      title: 'Urban Nomad',
      description: 'Oversized silhouettes with street-smart attitude',
      image: '/images/hero/outfit-casual.jpg',
      color: '#E06B80',
      trend: 'Streetwear',
      items: 18,
      season: 'All Season'
    },
    {
      id: 3,
      category: 'retro',
      title: 'Neo-Vintage',
      description: '90s revival with modern twists',
      image: '/images/hero/outfit-party.jpg',
      color: '#FFC69D',
      trend: 'Retro',
      items: 15,
      season: 'Spring/Summer'
    },
    {
      id: 4,
      category: 'bridal',
      title: 'Ethereal Bride',
      description: 'Dreamy silhouettes for your special day',
      image: '/images/hero/outfit-bridal.jpg',
      color: '#FFE6D4',
      trend: 'Bridal 2026',
      items: 32,
      season: 'All Season'
    },
    {
      id: 5,
      category: 'festive',
      title: 'Festival Glow',
      description: 'Bold colors and free-spirited styles',
      image: '/images/showcase/outfit1.jpg',
      color: '#CD2C58',
      trend: 'Festival',
      items: 21,
      season: 'Summer'
    },
    {
      id: 6,
      category: 'winter',
      title: 'Arctic Luxe',
      description: 'Luxurious layers for cold weather',
      image: '/images/showcase/outfit2.jpg',
      color: '#E06B80',
      trend: 'Winter 2026',
      items: 19,
      season: 'Winter'
    },
    {
      id: 7,
      category: 'street',
      title: 'Athleisure',
      description: 'Where comfort meets high fashion',
      image: '/images/showcase/outfit3.jpg',
      color: '#FFC69D',
      trend: 'Streetwear',
      items: 27,
      season: 'All Season'
    },
    {
      id: 8,
      category: 'retro',
      title: '70s Boho',
      description: 'Flowing fabrics and earthy tones',
      image: '/images/showcase/outfit4.jpg',
      color: '#FFE6D4',
      trend: 'Retro',
      items: 16,
      season: 'Fall'
    }
  ];

  const filteredCollections = activeFilter === 'all' 
    ? collections 
    : collections.filter(item => item.category === activeFilter);

  const featuredTrends = [
    { name: 'Minimalist Chic', image: '/images/hero/outfit-glam.jpg', count: '24 looks' },
    { name: 'Urban Nomad', image: '/images/hero/outfit-casual.jpg', count: '18 looks' },
    { name: 'Neo-Vintage', image: '/images/hero/outfit-party.jpg', count: '15 looks' },
    { name: 'Ethereal Bride', image: '/images/hero/outfit-bridal.jpg', count: '32 looks' }
  ];

  return (
    <div className="explore-page">
      {/* Animated Background */}
      <div className="explore-background">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-shape bg-shape-3"></div>
      </div>

      {/* Hero Section */}
      <section className="explore-hero">
        <div className="container">
          <div className="hero-content fade-up">
            <span className="hero-badge">TRENDING NOW</span>
            <h1 className="hero-title">
              Global Style <span className="gradient-text">VESTA</span>
            </h1>
            <p className="hero-subtitle">
              Explore the intersection of high-fashion trends and your unique aesthetic identity.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Trends Grid */}
      <section className="featured-trends">
        <div className="container">
          <div className="trends-grid">
            {featuredTrends.map((trend, index) => (
              <div 
                key={index} 
                className="trend-card scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="trend-image">
                  <img src={trend.image} alt={trend.name} />
                  <div className="trend-overlay">
                    <div className="trend-content">
                      <h3>{trend.name}</h3>
                      <p>{trend.count}</p>
                      <button className="trend-btn">
                        View Collection
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="filter-section">
        <div className="container">
          <div className="filter-wrapper fade-up">
            <div className="filter-scroll">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`filter-btn ${activeFilter === category.id ? 'active' : ''}`}
                  onClick={() => setActiveFilter(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>
            <div className="filter-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 4h18M3 12h18M3 20h18" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="collections-section">
        <div className="container">
          <div className="collections-grid">
            {filteredCollections.map((collection, index) => (
              <div 
                key={collection.id} 
                className="collection-card scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-image">
                  <img src={collection.image} alt={collection.title} />
                  <div className="card-badge" style={{ background: collection.color }}>
                    {collection.trend}
                  </div>
                </div>
                <div className="card-content">
                  <h3>{collection.title}</h3>
                  <p>{collection.description}</p>
                  <div className="card-meta">
                    <span className="meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      {collection.season}
                    </span>
                    <span className="meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 7h-4.5L15 4H9L8.5 7H4v2h16V7z" />
                        <rect x="4" y="10" width="16" height="10" rx="1" />
                      </svg>
                      {collection.items} items
                    </span>
                  </div>
                  <Link to={`/collection/${collection.id}`} className="card-link">
                    View Collection
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trend Categories */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header text-center fade-up">
            <h2>Shop by <span className="gradient-text">Category</span></h2>
            <p>Discover curated looks for every style</p>
          </div>

          <div className="categories-grid">
            {[
              { name: 'Winter 2026', image: '/images/hero/outfit-glam.jpg', count: '43 looks', color: '#CD2C58' },
              { name: 'Streetwear', image: '/images/hero/outfit-casual.jpg', count: '38 looks', color: '#E06B80' },
              { name: 'Retro', image: '/images/hero/outfit-party.jpg', count: '31 looks', color: '#FFC69D' },
              { name: 'Bridal', image: '/images/hero/outfit-bridal.jpg', count: '52 looks', color: '#FFE6D4' }
            ].map((category, index) => (
              <div key={index} className="category-card scale-in">
                <div className="category-image">
                  <img src={category.image} alt={category.name} />
                  <div className="category-overlay" style={{ background: `linear-gradient(135deg, ${category.color}80, transparent)` }}></div>
                </div>
                <div className="category-content">
                  <h4>{category.name}</h4>
                  <p>{category.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-card fade-up">
            <div className="newsletter-content">
              <h2>Stay Ahead of the Trends</h2>
              <p>Get weekly style inspiration and exclusive collections</p>
              <form className="newsletter-form">
                <input type="email" placeholder="Enter your email" />
                <button type="submit">
                  Subscribe
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </form>
            </div>
            <div className="newsletter-decoration">
              <div className="decoration-dots"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Explore;