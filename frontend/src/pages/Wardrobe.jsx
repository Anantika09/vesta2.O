import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Wardrobe.css';

const Wardrobe = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'shirt',
    image: '',
    color: ''
  });
  const [showForm, setShowForm] = useState(false);

  // Load items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wardrobe');
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('wardrobe', JSON.stringify(items));
  }, [items]);

  const addItem = (e) => {
    e.preventDefault();
    const item = {
      ...newItem,
      id: Date.now(),
      added: new Date().toLocaleDateString()
    };
    setItems([item, ...items]);
    setNewItem({ name: '', category: 'shirt', image: '', color: '' });
    setShowForm(false);
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const categories = ['shirt', 'pants', 'dress', 'shoes', 'jacket', 'accessories'];

  return (
    <div className="wardrobe-page">
      <div className="wardrobe-header">
        <h1>My Wardrobe ({items.length} items)</h1>
        <button 
          className="add-btn btn-primary" 
          onClick={() => setShowForm(true)}
        >
          + Add Clothing Item
        </button>
      </div>

      {/* ADD ITEM FORM */}
      {showForm && (
        <div className="add-item-form">
          <form onSubmit={addItem}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Item Name (e.g. Blue Cotton Shirt)"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                required
              />
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <input
                type="text"
                placeholder="Color (e.g. Blue, Black)"
                value={newItem.color}
                onChange={(e) => setNewItem({...newItem, color: e.target.value})}
              />
              <input
                type="text"
                placeholder="Image URL (optional)"
                value={newItem.image}
                onChange={(e) => setNewItem({...newItem, image: e.target.value})}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">Add Item</button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ITEMS GRID */}
      <div className="wardrobe-grid">
        {items.map((item) => (
          <div key={item.id} className="wardrobe-item">
            <div 
              className={`item-image ${item.category}`} 
              style={{ 
                backgroundImage: `url(${item.image || '/api/placeholder/300/300'})`,
                backgroundColor: item.color === 'black' ? '#333' : item.color || '#667eea'
              }}
            >
              {!item.image && (
                <span className="item-placeholder">
                  {item.category.toUpperCase()}
                </span>
              )}
            </div>
            <div className="item-info">
              <h3>{item.name}</h3>
              <p>Category: <span className="category">{item.category}</span></p>
              <p>Color: <span style={{color: item.color}}>{item.color}</span></p>
              <p>Added: {item.added}</p>
              <button 
                className="delete-btn"
                onClick={() => deleteItem(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="empty-state">
          <h2>Your wardrobe is empty</h2>
          <p>Add your first clothing item to get started!</p>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            Add First Item
          </button>
        </div>
      )}
    </div>
  );
};

export default Wardrobe;
