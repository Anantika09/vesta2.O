import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './About.css';
import PageHeader from '../components/PageHeader';
const About = () => {
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  return (
    <div className="about">
      {/* Dynamic Background */}
      <div className="about-bg">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
        <div className="bg-grid"></div>
      </div>

      <div className="about-container">
        {/* Hero Section */}
        <div className="about-hero" ref={addToRefs}>
          <div className="hero-brand">
            <span className="hero-tag">VESTA</span>
            <h1 className="hero-title">
              Your Digital <span className="hero-title-accent">Wardrobe</span>
            </h1>
            <p className="hero-text">
              Upload, organize, plan, and pack — all in one place.
            </p>
          </div>
        </div>

        {/* What Vesta Solves */}
        <div className="revelation-grid">
          <div className="revelation-card revelation-card-1" ref={addToRefs}>
            <span className="revelation-number">01</span>
            <h2 className="revelation-title">Upload & Organize</h2>
            <p className="revelation-text">
              Snap photos of your clothes. Organize by category — top wear, bottom wear, 
              footwear, accessories. Everything in one digital wardrobe.
            </p>
          </div>

          <div className="revelation-card revelation-card-2" ref={addToRefs}>
            <span className="revelation-number">02</span>
            <h2 className="revelation-title">Plan & Create</h2>
            <p className="revelation-text">
              Mix and match outfits virtually. Create looks for weddings, parties, 
              or casual days. Plan your packing before you travel.
            </p>
          </div>

          <div className="revelation-card revelation-card-3" ref={addToRefs}>
            <span className="revelation-number">03</span>
            <h2 className="revelation-title">Discover & Wear</h2>
            <p className="revelation-text">
              Search bridal, party, mehendi, corporate looks from around the world. 
              Track what you wore — no more "same outfit again" moments.
            </p>
          </div>
        </div>

        {/* Core Belief */}
        <div className="manifesto" ref={addToRefs}>
          <div className="manifesto-content">
            <span className="manifesto-tag">OUR BELIEF</span>
            <p className="manifesto-text">
              Your wardrobe should work for you, not against you.
            </p>
          </div>
          <div className="manifesto-visual">
            <div className="manifesto-line"></div>
            <div className="manifesto-dots"></div>
          </div>
        </div>

        {/* What Vesta Offers */}
        <div className="capabilities" ref={addToRefs}>
          <h2 className="capabilities-title">
            What <span className="capabilities-title-accent">Vesta</span> offers
          </h2>

          <div className="capabilities-grid">
            <div className="capability-card">
              <div className="capability-icon" style={{ background: '#CD2C58' }}></div>
              <h3 className="capability-name">Digital Wardrobe</h3>
              <p className="capability-desc">Store all your clothes, footwear, accessories</p>
            </div>

            <div className="capability-card">
              <div className="capability-icon" style={{ background: '#E06B80' }}></div>
              <h3 className="capability-name">Look Planner</h3>
              <p className="capability-desc">Mix and match outfits virtually</p>
            </div>

            <div className="capability-card">
              <div className="capability-icon" style={{ background: '#FFC69D' }}></div>
              <h3 className="capability-name">Suitcase Planner</h3>
              <p className="capability-desc">Plan packing before you travel</p>
            </div>

            <div className="capability-card">
              <div className="capability-icon" style={{ background: '#FFE6D4' }}></div>
              <h3 className="capability-name">Style Notes</h3>
              <p className="capability-desc">Save shopping lists and style ideas</p>
            </div>

            <div className="capability-card">
              <div className="capability-icon" style={{ background: '#CD2C58' }}></div>
              <h3 className="capability-name">Outfit History</h3>
              <p className="capability-desc">Track what you wore and when</p>
            </div>

            <div className="capability-card">
              <div className="capability-icon" style={{ background: '#E06B80' }}></div>
              <h3 className="capability-name">Style Discovery</h3>
              <p className="capability-desc">Find inspiration from around the world</p>
            </div>
          </div>
        </div>

        {/* Question & Answer */}
        <div className="question-block" ref={addToRefs}>
          <div className="question-card">
            <span className="question-mark">?</span>
            <p className="question-text">
              What should I wear today?
            </p>
            <div className="question-line"></div>
          </div>
        </div>

        <div className="answer-block" ref={addToRefs}>
          <div className="answer-card">
            <span className="answer-mark">!</span>
            <p className="answer-text">
              Vesta has the answer.
            </p>
          </div>
        </div>

        {/* Inspiration Categories */}
        <div className="inspiration" ref={addToRefs}>
          <div className="inspiration-strip">
            <span className="inspiration-item">Bridal</span>
            <span className="inspiration-item">•</span>
            <span className="inspiration-item">Party</span>
            <span className="inspiration-item">•</span>
            <span className="inspiration-item">Casual</span>
            <span className="inspiration-item">•</span>
            <span className="inspiration-item">Mehendi</span>
            <span className="inspiration-item">•</span>
            <span className="inspiration-item">Corporate</span>
            <span className="inspiration-item">•</span>
            <span className="inspiration-item">Festive</span>
            <span className="inspiration-item">•</span>
            <span className="inspiration-item">Traditional</span>
            <span className="inspiration-item">•</span>
            <span className="inspiration-item">Western</span>
            <span className="inspiration-item">•</span>
            <span className="inspiration-item">Ethnic</span>
            <span className="inspiration-item">•</span>
            <span className="inspiration-item">Beach Wear</span>
            <span className="inspiration-item">•</span>
            <span className="inspiration-item">Winter Wear</span>
          </div>
          <p className="inspiration-caption">Thousands of images. Every style. Every gender.</p>
        </div>

        {/* Promise */}
        <div className="promise" ref={addToRefs}>
          <p className="promise-text">
            Your digital wardrobe. Your personal stylist. Always with you.
          </p>
        </div>

        {/* CTA */}
        <div className="about-final" ref={addToRefs}>
          <Link to="/register" className="final-button">
            <span>Start your style journey</span>
            <span className="final-button-arrow">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
  return (
    <div className="about">
      <PageHeader 
        icon="✨" 
        title="About Vesta" 
        subtitle="Your digital wardrobe. Your personal stylist. Always with you."
      />
      
      <div className="about-container">
        {/* Rest of your about content */}
      </div>
    </div>
  );
};

export default About;