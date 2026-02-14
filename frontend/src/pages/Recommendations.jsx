import React, { useState, useEffect } from "react";
import "./Recommendations.css";

const sampleRecommendations = [
  {
    id: 1,
    type: "outfit",
    title: "Spring Festival Look",
    description: "Perfect for outdoor festivals and spring events",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800",
    confidence: 92,
    rating: 4.8,
    items: ["Floral Maxi Dress", "Straw Hat", "Leather Sandals"],
    occasion: "Festival",
    season: "Spring",
    saved: true,
    liked: true,
  },
  {
    id: 2,
    type: "makeup",
    title: "Soft Glam Makeup",
    description: "Elegant evening makeup with neutral tones",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800",
    confidence: 88,
    rating: 4.6,
    items: ["Foundation", "Neutral Eyeshadow", "Mascara"],
    occasion: "Evening",
    season: "All",
    saved: false,
    liked: false,
  },
];

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setRecommendations(sampleRecommendations);
    }, 1000);
  }, []);

  const toggleSave = (id) => {
    setRecommendations((prev) =>
      prev.map((rec) =>
        rec.id === id ? { ...rec, saved: !rec.saved } : rec
      )
    );
  };

  const toggleLike = (id) => {
    setRecommendations((prev) =>
      prev.map((rec) =>
        rec.id === id ? { ...rec, liked: !rec.liked } : rec
      )
    );
  };

  const filtered =
    filter === "all"
      ? recommendations
      : filter === "saved"
      ? recommendations.filter((r) => r.saved)
      : recommendations.filter((r) => r.type === filter);

  return (
    <div className="recommendations-page">
      <h1 className="page-title">AI Style Recommendations</h1>

      {/* Filters */}
      <div className="filters">
        {["all", "outfit", "makeup", "saved"].map((type) => (
          <button
            key={type}
            className={filter === type ? "active" : ""}
            onClick={() => setFilter(type)}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Loading */}
      {recommendations.length === 0 ? (
        <div className="loading">Loading Recommendations...</div>
      ) : (
        <div className="grid">
          {filtered.map((rec) => (
            <div key={rec.id} className="card">
              <img src={rec.image} alt={rec.title} />
              <div className="card-content">
                <h3>{rec.title}</h3>
                <p>{rec.description}</p>
                <div className="meta">
                  <span>{rec.confidence}% Match</span>
                  <span>⭐ {rec.rating}</span>
                </div>

                <div className="actions">
                  <button onClick={() => toggleSave(rec.id)}>
                    {rec.saved ? "Saved" : "Save"}
                  </button>
                  <button onClick={() => toggleLike(rec.id)}>
                    {rec.liked ? "Liked" : "Like"}
                  </button>
                  <button onClick={() => setSelected(rec)}>
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="modal" onClick={() => setSelected(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selected.title}</h2>
            <img src={selected.image} alt={selected.title} />
            <p>{selected.description}</p>
            <ul>
              {selected.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <button onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
