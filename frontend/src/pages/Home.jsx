import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const backToTop = document.getElementById("backToTop");
      if (window.scrollY > 300) {
        backToTop?.classList.add("visible");
      } else {
        backToTop?.classList.remove("visible");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">
            Discover Your Perfect Style with{" "}
            <span className="text-gradient">AI Intelligence</span>
          </h1>

          <p className="hero-subtitle">
            VESTA combines artificial intelligence with fashion expertise to
            provide personalized styling recommendations.
          </p>

          <div className="hero-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/wardrobe")}
            >
              Start Your Journey
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => navigate("/about")}
            >
              See How It Works
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features">
        <div className="container">
          <h2>
            Why Choose <span className="text-gradient">VESTA</span>
          </h2>

          <div className="features-grid">
            <div className="feature-card">
              <h3>AI Recommendations</h3>
              <p>
                Personalized outfit suggestions based on your wardrobe and
                preferences.
              </p>
            </div>

            <div className="feature-card">
              <h3>Digital Wardrobe</h3>
              <p>
                Upload and organize clothing in your virtual wardrobe.
              </p>
            </div>

            <div className="feature-card">
              <h3>Event Styling</h3>
              <p>
                Get perfect outfits for weddings, interviews and more.
              </p>
            </div>

            <div className="feature-card">
              <h3>Style Inspiration</h3>
              <p>
                Explore curated fashion inspiration from global trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Transform Your Style?</h2>
          <p>Start your style journey today — it's free.</p>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/wardrobe")}
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* BACK TO TOP */}
      <button
        className="back-to-top"
        id="backToTop"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
      >
        ↑
      </button>
    </div>
  );
};

export default Home;
