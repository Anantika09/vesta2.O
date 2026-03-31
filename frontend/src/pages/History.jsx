import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import PageHeader from '../components/PageHeader';
import './History.css';

const History = () => {
  const [outfitHistory, setOutfitHistory] = useState([]);
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // NEW

  useEffect(() => {
    fetchWardrobe();
    loadHistory();
  }, []);

  const fetchWardrobe = async () => {
    try {
      const data = await api.getWardrobe();
      setWardrobeItems(data.data);
    } catch (error) {
      console.error('Failed to load wardrobe:', error);
    }
  };

  const loadHistory = () => {
    const history = JSON.parse(localStorage.getItem('outfitHistory') || '[]');
    setOutfitHistory(history);
  };

  const saveHistory = (history) => {
    localStorage.setItem('outfitHistory', JSON.stringify(history));
    setOutfitHistory(history);
  };

  const markWorn = (item) => {
    const newEntry = {
      id: Date.now(),
      itemId: item._id,
      itemName: item.name,
      itemImage: item.imageUrl,
      category: item.category,
      date: new Date().toISOString()
    };
    const updatedHistory = [newEntry, ...outfitHistory];
    saveHistory(updatedHistory);
  };

  // NEW - Delete single entry
  const deleteEntry = (entryId) => {
    const updatedHistory = outfitHistory.filter(entry => entry.id !== entryId);
    saveHistory(updatedHistory);
    setShowDeleteConfirm(null);
  };

  // NEW - Clear all history
  const clearAllHistory = () => {
    if (window.confirm('Delete all history? This cannot be undone.')) {
      saveHistory([]);
    }
  };

  const getLastWorn = (itemId) => {
    const lastWorn = outfitHistory.find(entry => entry.itemId === itemId);
    return lastWorn ? new Date(lastWorn.date).toLocaleDateString() : 'Never worn';
  };

  const getWornCount = (itemId) => {
    return outfitHistory.filter(entry => entry.itemId === itemId).length;
  };

  const filteredHistory = selectedFilter === 'all' 
    ? outfitHistory 
    : outfitHistory.filter(entry => entry.category === selectedFilter);

  const categories = ['all', 'top', 'bottom', 'dress', 'footwear', 'accessories'];

  return (
    <div className="history-page">
        <PageHeader title="Outfit History" subtitle="Track what you wore and when — no more same outfit again moment" />
      
      <div className="history-layout">
        {/* Left Side - Wardrobe Items */}
        <div className="wardrobe-list">
          <h3>Your Wardrobe</h3>
          <div className="wardrobe-items">
            {wardrobeItems.map(item => (
              <div key={item._id} className="history-item-card">
                <img src={item.imageUrl} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p className="item-category">{item.category}</p>
                  <p className="last-worn">Last worn: {getLastWorn(item._id)}</p>
                  <p className="worn-count">Worn {getWornCount(item._id)} times</p>
                  <button className="mark-worn-btn" onClick={() => markWorn(item)}>
                    👗 Mark as Worn Today
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - History Timeline */}
        <div className="history-timeline">
          <div className="timeline-header">
            <h3>Your Style Journey</h3>
            <div className="timeline-header-right"> {/* NEW - wrapper for buttons */}
              <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                ))}
              </select>
              {outfitHistory.length > 0 && ( // NEW - Clear All button
                <button className="clear-all-btn" onClick={clearAllHistory}>
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="timeline">
            {filteredHistory.length === 0 ? (
              <p className="empty-timeline">No outfit history yet. Start tracking your looks!</p>
            ) : (
              filteredHistory.map(entry => (
                <div key={entry.id} className="timeline-entry">
                  <div className="timeline-date">
                    {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-image">
                      <img src={entry.itemImage} alt={entry.itemName} />
                    </div>
                    <div className="timeline-details">
                      <h4>{entry.itemName}</h4>
                      <p className="timeline-category">{entry.category}</p>
                      <p className="timeline-time">{new Date(entry.date).toLocaleTimeString()}</p>
                    </div>
                    {/* NEW - Delete button */}
                    <button 
                      className="delete-entry-btn"
                      onClick={() => setShowDeleteConfirm(entry.id)}
                      title="Delete this entry"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Stats Summary */}
          {outfitHistory.length > 0 && (
            <div className="stats-summary">
              <h4>Your Style Stats</h4>
              <div className="stats-grid">
                <div className="stat">
                  <span className="stat-number">{outfitHistory.length}</span>
                  <span className="stat-label">Total Worn</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{new Set(outfitHistory.map(e => e.itemId)).size}</span>
                  <span className="stat-label">Unique Items</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{Math.max(...outfitHistory.map(e => getWornCount(e.itemId)), 0)}</span>
                  <span className="stat-label">Most Worn</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NEW - Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">🗑️</div>
            <h3>Delete Entry</h3>
            <p>Are you sure you want to delete this outfit history entry?</p>
            <div className="confirm-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="delete-btn" onClick={() => deleteEntry(showDeleteConfirm)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;