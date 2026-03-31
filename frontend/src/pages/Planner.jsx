import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import api from '../utils/api';
import './Planner.css';

const Planner = () => {
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [selectedOutfit, setSelectedOutfit] = useState([]);
  const [lookName, setLookName] = useState('');
  const [savedLooks, setSavedLooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('build');

  useEffect(() => {
    fetchWardrobe();
    loadSavedLooks();
  }, []);

  const fetchWardrobe = async () => {
    try {
      const data = await api.getWardrobe();
      setWardrobeItems(data.data);
    } catch (error) {
      console.error('Failed to load wardrobe:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedLooks = () => {
    const looks = JSON.parse(localStorage.getItem('savedLooks') || '[]');
    setSavedLooks(looks);
  };

  const addToOutfit = (item) => {
    if (selectedOutfit.length < 8) {
      setSelectedOutfit([...selectedOutfit, item]);
    }
  };

  const removeFromOutfit = (index) => {
    setSelectedOutfit(selectedOutfit.filter((_, i) => i !== index));
  };

  const saveLook = () => {
    if (lookName && selectedOutfit.length > 0) {
      const newLook = {
        id: Date.now(),
        name: lookName,
        items: selectedOutfit,
        date: new Date().toISOString()
      };
      const updatedLooks = [newLook, ...savedLooks];
      setSavedLooks(updatedLooks);
      localStorage.setItem('savedLooks', JSON.stringify(updatedLooks));
      setSelectedOutfit([]);
      setLookName('');
      alert('Look saved successfully!');
    } else {
      alert('Please give your look a name and add some items');
    }
  };

  const loadLook = (look) => {
    setSelectedOutfit(look.items);
    setActiveTab('build');
  };

  const deleteLook = (lookId) => {
    if (window.confirm('Delete this look?')) {
      const updatedLooks = savedLooks.filter(look => look.id !== lookId);
      setSavedLooks(updatedLooks);
      localStorage.setItem('savedLooks', JSON.stringify(updatedLooks));
    }
  };

  if (loading) {
    return (
      <div className="planner-page">
        <PageHeader title="Look Planner" subtitle="Mix and match outfits virtually" />
        <div className="container"><div className="loading-spinner"></div></div>
      </div>
    );
  }

  return (
    <div className="planner-page">
      <PageHeader 
        title="Look Planner" 
        subtitle="Mix and match outfits virtually. Create stunning looks for any occasion" 
      />

      <div className="planner-container">
        {/* Tabs */}
        <div className="planner-tabs">
          <button 
            className={`tab-btn ${activeTab === 'build' ? 'active' : ''}`}
            onClick={() => setActiveTab('build')}
          >
            Build Look
          </button>
          <button 
            className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            Saved Looks ({savedLooks.length})
          </button>
        </div>

        {activeTab === 'build' ? (
          <div className="build-section">
            <div className="build-grid">
              {/* Wardrobe Items */}
              <div className="wardrobe-panel">
                <div className="panel-header">
                  <h3>Your Wardrobe</h3>
                  <span>{wardrobeItems.length} items</span>
                </div>
                <div className="items-scroll">
                  <div className="items-grid">
                    {wardrobeItems.map(item => (
                      <div 
                        key={item._id} 
                        className="item-card"
                        onClick={() => addToOutfit(item)}
                      >
                        <div className="item-image">
                          <img src={item.imageUrl} alt={item.name} />
                          <div className="item-overlay">
                            <span>+ Add</span>
                          </div>
                        </div>
                        <p className="item-name">{item.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Current Outfit */}
              <div className="outfit-panel">
                <div className="panel-header">
                  <h3>Your Look</h3>
                  <span>{selectedOutfit.length}/8 items</span>
                </div>
                
                <div className="outfit-area">
                  {selectedOutfit.length === 0 ? (
                    <div className="empty-outfit">
                      <div className="empty-icon">✨</div>
                      <p>Click on items to build your look</p>
                    </div>
                  ) : (
                    <div className="outfit-grid">
                      {selectedOutfit.map((item, idx) => (
                        <div key={idx} className="outfit-piece">
                          <img src={item.imageUrl} alt={item.name} />
                          <button 
                            className="remove-piece"
                            onClick={() => removeFromOutfit(idx)}
                          >
                            ✕
                          </button>
                          <span className="piece-number">{idx + 1}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="save-area">
                  <input
                    type="text"
                    placeholder="Name your look..."
                    value={lookName}
                    onChange={(e) => setLookName(e.target.value)}
                    className="look-name-input"
                  />
                  <button 
                    className="save-look-btn"
                    onClick={saveLook}
                    disabled={!lookName || selectedOutfit.length === 0}
                  >
                    Save Look
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="saved-looks-section">
            <h3>Your Saved Looks</h3>
            <div className="looks-grid">
              {savedLooks.length === 0 ? (
                <div className="empty-saved">
                  <div className="empty-icon">📁</div>
                  <p>No saved looks yet. Create your first look!</p>
                </div>
              ) : (
                savedLooks.map((look) => (
                  <div key={look.id} className="look-card">
                    <div className="look-card-header">
                      <h4>{look.name}</h4>
                      <button className="delete-look" onClick={() => deleteLook(look.id)}>✕</button>
                    </div>
                    <p className="look-date">{new Date(look.date).toLocaleDateString()}</p>
                    <div className="look-preview">
                      {look.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="look-preview-item">
                          <img src={item.imageUrl} alt={item.name} />
                        </div>
                      ))}
                      {look.items.length > 3 && <span className="more-count">+{look.items.length - 3}</span>}
                    </div>
                    <div className="look-footer">
                      <span className="look-items-count">{look.items.length} items</span>
                      <button className="load-look-btn" onClick={() => loadLook(look)}>Load Look →</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Planner;