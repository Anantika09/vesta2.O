import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Wardrobe.css';

const Wardrobe = () => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: 'shirt', image: '', color: '' });

  useEffect(() => {
    const saved = localStorage.getItem('wardrobe');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('wardrobe', JSON.stringify(items));
  }, [items]);

  const addItem = (e) => {
    e.preventDefault();
    const item = { ...newItem, id: Date.now(), added: new Date().toLocaleDateString() };
    setItems([item, ...items]);
    setNewItem({ name: '', category: 'shirt', image: '', color: '' });
    setShowForm(false);
  };

  const deleteItem = (id) => setItems(items.filter(item => item.id !== id));

  return (
    <div className="wardrobe-page">
      <div className="container">
        <header className="wardrobe-header">
          <div>
            <h1>My Wardrobe</h1>
            <p className="item-count">{items.length} Curated Items</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Close Form' : '+ Add Item'}
          </button>
        </header>

        {showForm && (
          <div className="add-item-container glass-card animate-slide-down">
            <form onSubmit={addItem} className="premium-form">
              <div className="form-grid">
                <input type="text" placeholder="Item Name (e.g. Silk Shirt)" value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})} required />
                
                <select value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})}>
                  {['shirt', 'pants', 'dress', 'shoes', 'jacket', 'accessories'].map(cat => (
                    <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                  ))}
                </select>

                <input type="text" placeholder="Color" value={newItem.color}
                  onChange={(e) => setNewItem({...newItem, color: e.target.value})} />
                
                <input type="text" placeholder="Image URL" value={newItem.image}
                  onChange={(e) => setNewItem({...newItem, image: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary full-width">Save to Wardrobe</button>
            </form>
          </div>
        )}

        <div className="wardrobe-grid">
          {items.map((item) => (
            <div key={item.id} className="wardrobe-item-card glass-card">
              <div className="item-preview" style={{ 
                backgroundImage: `url(${item.image || 'https://via.placeholder.com/300'})`,
                backgroundColor: item.color || 'var(--vesta-shell)' 
              }}>
                <button className="delete-overlay" onClick={() => deleteItem(item.id)}>✕</button>
              </div>
              <div className="item-details">
                <span className="item-cat">{item.category}</span>
                <h3>{item.name}</h3>
                <div className="item-footer">
                  <span className="item-color-dot" style={{ background: item.color }}></span>
                  <span className="item-date">{item.added}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="empty-state glass-card">
            <h2>Your collection is empty</h2>
            <p>Start building your digital closet to receive AI styling tips.</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>Add First Item</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wardrobe;