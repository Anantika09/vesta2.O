import React, { useState, useEffect } from "react";
import "./Wardrobe.css";

const sampleItems = [
  {
    id: 1,
    name: "Black Leather Jacket",
    type: "clothing",
    category: "outerwear",
    color: "#000000",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=400",
    dateAdded: "2024-02-15",
    tags: ["Casual", "Edgy", "Versatile"],
    favorite: true,
  },
  {
    id: 2,
    name: "White Silk Blouse",
    type: "clothing",
    category: "top",
    color: "#FFFFFF",
    image:
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=400",
    dateAdded: "2024-02-10",
    tags: ["Formal", "Office"],
    favorite: false,
  },
  {
    id: 3,
    name: "Blue Denim Jeans",
    type: "clothing",
    category: "bottom",
    color: "#0000FF",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=400",
    dateAdded: "2024-02-05",
    tags: ["Casual", "Comfort"],
    favorite: true,
  },
];

export default function Wardrobe() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setItems(sampleItems);
    }, 800);
  }, []);

  const toggleFavorite = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, favorite: !item.favorite } : item
      )
    );
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredItems =
    filter === "all"
      ? items
      : filter === "favorites"
      ? items.filter((item) => item.favorite)
      : items.filter((item) => item.type === filter);

  const totalItems = items.length;
  const categories = [...new Set(items.map((i) => i.category))].length;

  const tops = items.filter((i) => i.category === "top").length;
  const bottoms = items.filter((i) => i.category === "bottom").length;
  const dresses = items.filter((i) => i.category === "dress").length;

  const outfitCombinations = tops * bottoms + dresses;

  return (
    <div className="wardrobe-page">
      <h1 className="hero-title">
        Your Digital <span className="highlight">Wardrobe</span>
      </h1>

      {/* Stats */}
      <div className="wardrobe-stats">
        <div className="stat-card">
          <div className="stat-number">{totalItems}</div>
          <p>Total Items</p>
        </div>

        <div className="stat-card">
          <div className="stat-number">{categories}</div>
          <p>Categories</p>
        </div>

        <div className="stat-card">
          <div className="stat-number">{outfitCombinations}</div>
          <p>Possible Outfits</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        {["all", "clothing", "favorites"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={filter === type ? "active" : ""}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="wardrobe-grid">
        {filteredItems.length === 0 ? (
          <div className="empty">
            <p>No items found.</p>
            <button onClick={() => setShowModal(true)}>Add Item</button>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="wardrobe-card">
              <img src={item.image} alt={item.name} />
              <div className="card-body">
                <h4>{item.name}</h4>
                <div className="meta">
                  <span>{item.category}</span>
                  <div
                    className="color-dot"
                    style={{ background: item.color }}
                  ></div>
                </div>

                <div className="tags">
                  {item.tags.map((tag, i) => (
                    <span key={i}>{tag}</span>
                  ))}
                </div>

                <div className="actions">
                  <button onClick={() => toggleFavorite(item.id)}>
                    {item.favorite ? "❤️" : "🤍"}
                  </button>
                  <button onClick={() => deleteItem(item.id)}>🗑</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Add New Item</h3>
            <p>(Upload functionality will be connected to backend later)</p>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
