import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import looksData from '../data/looksData';
import PageHeader from '../components/PageHeader';
import './Explore.css';

const Explore = () => {
  //const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Ensure looksData is an array
  const allLooks = Array.isArray(looksData) ? looksData : [];

  // Get unique categories from looksData
  /*const categories = [
    { id: 'all', label: 'All', icon: '✨', count: allLooks.length },
    ...(Array.isArray(allLooks) && allLooks.length > 0 
      ? [...new Set(allLooks.map(look => look.category))]
          .filter(cat => cat && cat !== 'all')
          .map(cat => ({
            id: cat,
            label: cat.charAt(0).toUpperCase() + cat.slice(1),
            icon: getCategoryIcon(cat),
            count: allLooks.filter(l => l.category === cat).length
          }))
      : [])
  ];
*/
  function getCategoryIcon(category) {
    const icons = {
      bridal: '💍',
      party: '🎉',
      mehendi: '🌿',
      corporate: '💼',
      casual: '👕',
      festive: '🎊',
      traditional: '👘',
      western: '👗',
      ethnic: '🕌',
      beach: '🏖️',
      winter: '❄️'
    };
    return icons[category] || '✨';
  }

  const trendingSearches = [
    "Bridal look", "Party outfit", "Mehendi design", "Corporate wear", 
    "Casual chic", "Festival outfit", "Wedding guest", "Lehenga styles"
  ];

  useEffect(() => {
    // Set initial results
    setSearchResults(allLooks);
  }, [allLooks]);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    
    setTimeout(() => {
      let results = allLooks;
      
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        results = results.filter(look => 
          look.title?.toLowerCase().includes(query) ||
          (look.tags && look.tags.some(tag => tag.toLowerCase().includes(query)))
        );
      }
      
      if (activeCategory !== 'all') {
        results = results.filter(look => look.category === activeCategory);
      }
      
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  /*const filterByCategory = (categoryId) => {
    setActiveCategory(categoryId);
    
    let results = allLooks;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(look => 
        look.title?.toLowerCase().includes(query) ||
        (look.tags && look.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    if (categoryId !== 'all') {
      results = results.filter(look => look.category === categoryId);
    }
    
    setSearchResults(results);
  };
*/
  const quickSearch = (term) => {
    setSearchQuery(term);
    setTimeout(() => {
      const query = term.toLowerCase();
      let results = allLooks.filter(look => 
        look.title?.toLowerCase().includes(query) ||
        (look.tags && look.tags.some(tag => tag.toLowerCase().includes(query)))
      );
      
      if (activeCategory !== 'all') {
        results = results.filter(look => look.category === activeCategory);
      }
      
      setSearchResults(results);
    }, 100);
  };

  return (
    <div className="explore-page">
      {/* Hero Section */}
      
      <section className="explore-hero">
        <div className="container">
          <h1 className="hero-title">
            Find Your <span className="gradient-text">Perfect Look</span>
          </h1>
          <p className="hero-subtitle">
            Explore thousands of outfit ideas, bridal looks, party wear, mehendi designs, and more
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="search-section">
            <div className="search-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search for bridal look, party outfit, mehendi design..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">Search</button>
            </div>
          </form>

          {/* Trending Tags */}
          <div className="trending-section">
            <span className="trending-label">Trending:</span>
            <div className="trending-tags">
              {trendingSearches.map((term, index) => (
                <button key={index} className="trending-tag" onClick={() => quickSearch(term)}>
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      
      {/* Results Grid */}
      <section className="results-section">
        <div className="container">
          {isSearching ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Finding inspiration for you...</p>
            </div>
          ) : (
            <>
              {searchResults.length === 0 ? (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h3>No looks found</h3>
                  <p>Try searching for something else or browse our categories</p>
                  <div className="suggestion-tags">
                    {trendingSearches.slice(0, 4).map((term, i) => (
                      <button key={i} className="suggestion-tag" onClick={() => quickSearch(term)}>
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="results-grid">
                  {searchResults.map((item, index) => (
                    <div key={item.id || index} className="result-card" style={{ animationDelay: `${index * 0.05}s` }}>
                      <div className="result-image">
                        <img src={item.image} alt={item.title} />
                        <div className="result-badge">{item.category}</div>
                        <div className="result-overlay">
                          <button className="save-btn">
                            📌 Save
                          </button>
                          <button className="like-btn">
                            ❤️ {item.likes || 0}
                          </button>
                        </div>
                      </div>
                      <div className="result-info">
                        <h4 className="result-title">{item.title}</h4>
                        <div className="result-tags">
                          {item.tags && item.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="result-tag">#{tag}</span>
                          ))}
                        </div>
                        <div className="result-stats">
                          <span>❤️ {item.likes || 0}</span>
                          <span>📌 {item.saves || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-card">
            <div className="newsletter-content">
              <h3>Get Weekly Style Inspiration</h3>
              <p>Subscribe to get the latest trends, outfit ideas, and style tips</p>
              <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Enter your email" />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
  return (
    <div className="explore-page">
      <PageHeader 
        icon="🔍" 
        title="Style Discovery" 
        subtitle="Find inspiration from bridal, party, corporate looks worldwide"
      />
      
      {/* Rest of your explore content */}
      <div className="container">
        {/* Your existing explore content */}
      </div>
    </div>
  );
  
};

export default Explore;