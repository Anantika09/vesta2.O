import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import api from '../utils/api';
import './Wardrobe.css';

const Wardrobe = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploadData, setUploadData] = useState({
    name: '',
    category: 'top-wear',
    subCategory: '',
    occasion: 'casual',
    season: 'all',
    color: '',
    brand: '',
    size: '',
    image: null,
    imagePreview: null
  });

  const categories = [
    { id: 'top-wear', name: 'Top Wear', icon: '👕' },
    { id: 'bottom-wear', name: 'Bottom Wear', icon: '👖' },
    { id: 'dresses', name: 'Dresses', icon: '👗' },
    { id: 'footwear', name: 'Footwear', icon: '👟' },
    { id: 'accessories', name: 'Accessories', icon: '💍' },
    { id: 'bags', name: 'Bags', icon: '👜' },
    { id: 'outerwear', name: 'Outerwear', icon: '🧥' }
  ];

  useEffect(() => {
    fetchWardrobe();
  }, []);

  const fetchWardrobe = async () => {
    try {
      setLoading(true);
      const data = await api.getWardrobe();
      setItems(data.data || []);
    } catch (error) {
      console.error('Failed to load wardrobe:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadData({
          ...uploadData,
          image: file,
          imagePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadData.image) {
      alert('Please select an image');
      return;
    }
    
    const formData = new FormData();
    formData.append('name', uploadData.name);
    formData.append('category', uploadData.category);
    formData.append('subCategory', uploadData.subCategory);
    formData.append('occasion', uploadData.occasion);
    formData.append('season', uploadData.season);
    formData.append('color', uploadData.color);
    formData.append('brand', uploadData.brand);
    formData.append('size', uploadData.size);
    formData.append('image', uploadData.image);

    try {
      const response = await api.addToWardrobe(formData);
      setItems([response.data.item, ...items]);
      setShowUpload(false);
      setUploadData({
        name: '',
        category: 'top-wear',
        subCategory: '',
        occasion: 'casual',
        season: 'all',
        color: '',
        brand: '',
        size: '',
        image: null,
        imagePreview: null
      });
      alert('Item added successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload item');
    }
  };

  const deleteItem = async (itemId) => {
    if (window.confirm('Delete this item?')) {
      try {
        await api.deleteWardrobeItem(itemId);
        setItems(items.filter(item => item._id !== itemId));
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : '👕';
  };

  if (loading) {
    return (
      <div className="wardrobe-page">
        <PageHeader title="My Digital Wardrobe" subtitle="Upload and organize all your clothes in one place" />
        <div className="container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="wardrobe-page">
      <PageHeader title="My Digital Wardrobe" subtitle="Upload and organize all your clothes in one place" />
      
      <div className="container">
        {/* Upload Button */}
        <div className="wardrobe-actions">
          <button className="upload-btn" onClick={() => setShowUpload(true)}>
            <span>+</span> Add New Item
          </button>
        </div>

        {/* Category Filters */}
        <div className="category-filters">
          <button 
            className={`filter-chip ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All
            <span className="count">{items.length}</span>
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`filter-chip ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="filter-icon">{cat.icon}</span>
              {cat.name}
              <span className="count">{items.filter(i => i.category === cat.id).length}</span>
            </button>
          ))}
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👗</div>
            <h3>Your wardrobe is empty</h3>
            <p>Start by adding your first clothing item</p>
            <button className="empty-btn" onClick={() => setShowUpload(true)}>Add Your First Item</button>
          </div>
        ) : (
          <div className="wardrobe-grid">
            {filteredItems.map(item => (
              <div key={item._id} className="wardrobe-card">
                <button className="delete-item" onClick={() => deleteItem(item._id)}>✕</button>
                <div className="card-image">
                  <img src={item.imageUrl} alt={item.name} />
                  <div className="card-category">{getCategoryIcon(item.category)}</div>
                </div>
                <div className="card-info">
                  <h4>{item.name}</h4>
                  <div className="card-tags">
                    {item.occasion && <span className="tag">{item.occasion}</span>}
                    {item.color && <span className="tag color-tag" style={{ backgroundColor: item.color.toLowerCase() }}>{item.color}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="modal-overlay" onClick={() => setShowUpload(false)}>
          <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Item</h3>
              <button className="close-modal" onClick={() => setShowUpload(false)}>✕</button>
            </div>
            <form onSubmit={handleUpload}>
              <div className="image-upload-area" onClick={() => document.getElementById('imageInput').click()}>
                {uploadData.imagePreview ? (
                  <img src={uploadData.imagePreview} alt="Preview" />
                ) : (
                  <div className="upload-placeholder">
                    <span>📸</span>
                    <p>Click to upload photo</p>
                  </div>
                )}
                <input type="file" id="imageInput" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} required />
              </div>

              <input type="text" placeholder="Item name" value={uploadData.name} onChange={(e) => setUploadData({...uploadData, name: e.target.value})} required />
              
              <select value={uploadData.category} onChange={(e) => setUploadData({...uploadData, category: e.target.value})}>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>

              <div className="form-row">
                <select value={uploadData.occasion} onChange={(e) => setUploadData({...uploadData, occasion: e.target.value})}>
                  <option value="casual">Casual</option>
                  <option value="party">Party</option>
                  <option value="corporate">Corporate</option>
                  <option value="festive">Festive</option>
                  <option value="travel">Travel</option>
                  <option value="wedding">Wedding</option>
                </select>

                <select value={uploadData.color} onChange={(e) => setUploadData({...uploadData, color: e.target.value})}>
                  <option value="">Select color</option>
                  <option value="Black">Black</option>
                  <option value="White">White</option>
                  <option value="Red">Red</option>
                  <option value="Blue">Blue</option>
                  <option value="Green">Green</option>
                  <option value="Pink">Pink</option>
                </select>
              </div>

              <div className="form-row">
                <input type="text" placeholder="Brand" value={uploadData.brand} onChange={(e) => setUploadData({...uploadData, brand: e.target.value})} />
                <input type="text" placeholder="Size" value={uploadData.size} onChange={(e) => setUploadData({...uploadData, size: e.target.value})} />
              </div>

              <button type="submit" className="submit-btn">Add to Wardrobe</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wardrobe;