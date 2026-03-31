import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import api from '../utils/api';
import './Suitcase.css';

const Suitcase = () => {
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [trips, setTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [showCreateTrip, setShowCreateTrip] = useState(false);
  const [newTrip, setNewTrip] = useState({ name: '', destination: '', duration: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWardrobe();
    loadTrips();
  }, []);

  const fetchWardrobe = async () => {
    try {
      const data = await api.getWardrobe();
      setWardrobeItems(data.data || []);
    } catch (error) {
      console.error('Failed to load wardrobe:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTrips = () => {
    const savedTrips = JSON.parse(localStorage.getItem('trips') || '[]');
    setTrips(savedTrips);
    if (savedTrips.length > 0) {
      setCurrentTrip(savedTrips[0]);
    }
  };

  const saveTrips = (updatedTrips) => {
    localStorage.setItem('trips', JSON.stringify(updatedTrips));
    setTrips(updatedTrips);
  };

  const createTrip = () => {
    if (!newTrip.name.trim()) {
      alert('Please enter a trip name');
      return;
    }
    
    const trip = { 
      id: Date.now(), 
      name: newTrip.name,
      destination: newTrip.destination || 'Not specified',
      duration: newTrip.duration || '?',
      packingList: [], 
      createdAt: new Date().toISOString() 
    };
    
    const updatedTrips = [trip, ...trips];
    saveTrips(updatedTrips);
    setCurrentTrip(trip);
    setShowCreateTrip(false);
    setNewTrip({ name: '', destination: '', duration: '' });
  };

  const addToPacking = (item) => {
    if (!currentTrip) {
      alert('Please select a trip first');
      return;
    }
    if (currentTrip.packingList.some(p => p._id === item._id)) {
      alert(`${item.name} is already in your packing list`);
      return;
    }
    const updatedTrips = trips.map(trip => 
      trip.id === currentTrip.id 
        ? { ...trip, packingList: [...trip.packingList, { ...item, packed: false }] } 
        : trip
    );
    saveTrips(updatedTrips);
    setCurrentTrip({ ...currentTrip, packingList: [...currentTrip.packingList, { ...item, packed: false }] });
  };

  const removeFromPacking = (itemId) => {
    if (!currentTrip) return;
    const updatedTrips = trips.map(trip => 
      trip.id === currentTrip.id 
        ? { ...trip, packingList: trip.packingList.filter(i => i._id !== itemId) } 
        : trip
    );
    saveTrips(updatedTrips);
    setCurrentTrip({ ...currentTrip, packingList: currentTrip.packingList.filter(i => i._id !== itemId) });
  };

  const togglePacked = (itemId) => {
    if (!currentTrip) return;
    const updatedTrips = trips.map(trip => 
      trip.id === currentTrip.id ? { 
        ...trip, 
        packingList: trip.packingList.map(item => 
          item._id === itemId ? { ...item, packed: !item.packed } : item
        ) 
      } : trip
    );
    saveTrips(updatedTrips);
    setCurrentTrip({ 
      ...currentTrip, 
      packingList: currentTrip.packingList.map(item => 
        item._id === itemId ? { ...item, packed: !item.packed } : item
      ) 
    });
  };

  const deleteTrip = (tripId) => {
    if (window.confirm('Delete this trip?')) {
      const updatedTrips = trips.filter(trip => trip.id !== tripId);
      saveTrips(updatedTrips);
      if (currentTrip?.id === tripId) {
        setCurrentTrip(updatedTrips[0] || null);
      }
    }
  };

  const getPackedCount = () => {
    if (!currentTrip) return 0;
    return currentTrip.packingList.filter(item => item.packed).length;
  };

  const getProgressPercent = () => {
    if (!currentTrip || currentTrip.packingList.length === 0) return 0;
    return Math.round((getPackedCount() / currentTrip.packingList.length) * 100);
  };

  if (loading) {
    return (
      <div className="suitcase-page">
        <PageHeader title="Suitcase Planner" subtitle="Plan your packing before travel. Never forget anything again" />
        <div className="container"><div className="loading-spinner"></div></div>
      </div>
    );
  }

  return (
    <div className="suitcase-page">
      <PageHeader 
        title="Suitcase Planner" 
        subtitle="Plan your packing before travel. Never forget anything again" 
      />

      <div className="suitcase-container">
        <div className="suitcase-layout">
          {/* Trips Sidebar */}
          <div className="trips-sidebar">
            <button className="create-trip-btn" onClick={() => setShowCreateTrip(true)}>
              + New Trip
            </button>
            <div className="trips-list">
              {trips.length === 0 ? (
                <div className="no-trips">
                  <div className="no-trips-icon">✈️</div>
                  <p>No trips yet</p>
                  <span>Create your first trip</span>
                </div>
              ) : (
                trips.map(trip => (
                  <div 
                    key={trip.id} 
                    className={`trip-item ${currentTrip?.id === trip.id ? 'active' : ''}`} 
                    onClick={() => setCurrentTrip(trip)}
                  >
                    <div className="trip-info">
                      <h4>{trip.name}</h4>
                      <p>{trip.destination || 'No destination'} • {trip.duration || '?'} days</p>
                      <div className="trip-stats">
                        <span className="trip-items">{trip.packingList.length} items</span>
                        {trip.packingList.length > 0 && (
                          <span className="trip-progress">
                            {Math.round((trip.packingList.filter(i => i.packed).length / trip.packingList.length) * 100)}%
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="delete-trip" onClick={(e) => { e.stopPropagation(); deleteTrip(trip.id); }}>
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Packing Area */}
          <div className="packing-area">
            {currentTrip ? (
              <>
                <div className="current-trip-header">
                  <div className="trip-title">
                    <h2>{currentTrip.name}</h2>
                    <p>{currentTrip.destination || 'Destination not set'} • {currentTrip.duration || '?'} days</p>
                  </div>
                  <div className="packing-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${getProgressPercent()}%` }}></div>
                    </div>
                    <span className="progress-text">{getPackedCount()} / {currentTrip.packingList.length} packed</span>
                  </div>
                </div>

                <div className="packing-grid">
                  {/* Available Items */}
                  <div className="available-items">
                    <div className="section-header">
                      <h3>Your Wardrobe</h3>
                      <span>{wardrobeItems.length} items</span>
                    </div>
                    <div className="items-scroll">
                      <div className="items-grid">
                        {wardrobeItems.map(item => {
                          const isInPacking = currentTrip.packingList.some(p => p._id === item._id);
                          return (
                            <div 
                              key={item._id} 
                              className={`item-card ${isInPacking ? 'added' : ''}`}
                              onClick={() => !isInPacking && addToPacking(item)}
                            >
                              <div className="item-image">
                                <img src={item.imageUrl} alt={item.name} />
                                {!isInPacking && (
                                  <div className="item-overlay">
                                    <span>+ Add</span>
                                  </div>
                                )}
                                {isInPacking && (
                                  <div className="item-checked">
                                    <span>✓ Added</span>
                                  </div>
                                )}
                              </div>
                              <p className="item-name">{item.name}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Packing List */}
                  <div className="packing-list">
                    <div className="section-header">
                      <h3>Packing List</h3>
                      <span>{currentTrip.packingList.length} items</span>
                    </div>
                    <div className="packing-scroll">
                      {currentTrip.packingList.length === 0 ? (
                        <div className="empty-packing">
                          <div className="empty-icon">📦</div>
                          <p>Your packing list is empty</p>
                          <span>Click on items from your wardrobe to add them</span>
                        </div>
                      ) : (
                        currentTrip.packingList.map(item => (
                          <div key={item._id} className={`packing-item ${item.packed ? 'packed' : ''}`}>
                            <div className="packing-checkbox" onClick={() => togglePacked(item._id)}>
                              {item.packed ? '✓' : '○'}
                            </div>
                            <img src={item.imageUrl} alt={item.name} />
                            <div className="packing-info">
                              <p className="packing-name">{item.name}</p>
                              <span className="packing-category">{item.category}</span>
                            </div>
                            <button className="remove-item" onClick={() => removeFromPacking(item._id)}>
                              ✕
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {currentTrip.packingList.length > 0 && (
                      <div className="packing-tips">
                        <div className="tips-icon">💡</div>
                        <div className="tips-content">
                          <p>Packing Tips</p>
                          <span>Roll your clothes to save space • Pack heavier items at the bottom</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="no-trip-selected">
                <div className="empty-state">
                  <div className="empty-icon">✈️</div>
                  <h3>No Trip Selected</h3>
                  <p>Select a trip from the sidebar or create a new one to start packing</p>
                  <button className="create-trip-large" onClick={() => setShowCreateTrip(true)}>
                    + Create New Trip
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simple Modal - Guaranteed to Work */}
      {showCreateTrip && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            width: '90%',
            maxWidth: '450px',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '20px' }}>Create New Trip</h3>
              <button 
                onClick={() => setShowCreateTrip(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#999'
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Trip Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Goa Getaway" 
                  value={newTrip.name} 
                  onChange={(e) => setNewTrip({...newTrip, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    fontSize: '14px'
                  }}
                  autoFocus
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Destination</label>
                <input 
                  type="text" 
                  placeholder="e.g., Goa, India" 
                  value={newTrip.destination} 
                  onChange={(e) => setNewTrip({...newTrip, destination: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Duration (days)</label>
                <input 
                  type="number" 
                  placeholder="Number of days" 
                  value={newTrip.duration} 
                  onChange={(e) => setNewTrip({...newTrip, duration: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
            <div style={{
              padding: '16px 24px 24px',
              borderTop: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button 
                onClick={() => setShowCreateTrip(false)}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid #e0e0e0',
                  borderRadius: '30px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={createTrip}
                style={{
                  padding: '10px 24px',
                  background: '#CD2C58',
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer'
                }}
              >
                Create Trip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suitcase;