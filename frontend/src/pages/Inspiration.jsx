import React, { useEffect, useState } from "react";
import "./Inspiration.css";
import PageHeader from '../components/PageHeader';
const sampleInspiration = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800",
    title: "Evening Glam Look",
    description: "Perfect for formal events and evening parties",
    category: "outfits",
    occasion: "formal",
    season: "all",
    tags: ["Glam", "Evening", "Sparkle", "Party", "Dress"],
    likes: 1245,
    saves: 876,
    author: "StyleByMaria",
    date: "2024-02-20",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=800",
    title: "Casual Weekend Style",
    description: "Comfortable yet stylish for weekend activities",
    category: "outfits",
    occasion: "casual",
    season: "summer",
    tags: ["Casual", "Comfort", "Weekend", "Streetwear", "Denim"],
    likes: 987,
    saves: 543,
    author: "UrbanChic",
    date: "2024-02-18",
  },
];

const Inspiration = () => {
  const [inspiration, setInspiration] = useState([]);

  useEffect(() => {
    setInspiration(sampleInspiration);
  }, []);

  return (
    <div className="inspiration-page">
      <div className="page-header-inspiration">
        <h1>
          Style <span className="gradient-text">Inspiration</span>
        </h1>
        <p>Discover curated fashion looks</p>
      </div>

      <div className="inspiration-grid-page">
        {inspiration.map((item) => (
          <div className="inspiration-card-page" key={item.id}>
            <div className="inspiration-image-page">
              <img src={item.image} alt={item.title} />
            </div>

            <div className="inspiration-content-page">
              <h3>{item.title}</h3>
              <p>{item.description}</p>

              <div className="inspiration-tags-page">
                {item.tags.map((tag, index) => (
                  <span key={index} className="inspiration-tag-page">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="inspiration-stats-page">
                ❤️ {item.likes} &nbsp; 🔖 {item.saves}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inspiration;
