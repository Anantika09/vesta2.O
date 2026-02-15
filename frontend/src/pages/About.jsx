import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

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
        {/* Hero */}
        <div className="about-hero" ref={addToRefs}>
          <span className="hero-tag"><h1>VESTA</h1></span>
          <h1 className="hero-title">
            Style <span className="hero-title-accent">intelligence</span>
          </h1>
          
          
        </div>

        {/* Revelation Grid */}
        <div className="revelation-grid">
          <div className="revelation-card revelation-card-1" ref={addToRefs}>
            <span className="revelation-number">01</span>
            <h2 className="revelation-title">You own more than you remember</h2>
            <p className="revelation-text">
              Buried under piles. Forgotten at the back. Clothes you love but never see. 
              Vesta brings them all to light.
            </p>
          </div>

          <div className="revelation-card revelation-card-2" ref={addToRefs}>
            <span className="revelation-number">02</span>
            <h2 className="revelation-title">Every outfit, instantly visible</h2>
            <p className="revelation-text">
              Wedding in two hours? Scroll your entire wardrobe in seconds. No more digging.
            </p>
          </div>

          <div className="revelation-card revelation-card-3" ref={addToRefs}>
            <span className="revelation-number">03</span>
            <h2 className="revelation-title">Answers, not paragraphs</h2>
            <p className="revelation-text">
              "Makeup for my skin tone?" "Hairstyle that suits me?" Vesta shows you.
            </p>
          </div>
        </div>

        {/* Manifesto */}
        <div className="manifesto" ref={addToRefs}>
          <div className="manifesto-content">
            <span className="manifesto-tag">THE BELIEF</span>
            <p className="manifesto-text">
              Fashion advice shouldn't be a blog post. It should be a mirror.
            </p>
          </div>
          <div className="manifesto-visual">
            <div className="manifesto-line"></div>
            <div className="manifesto-dots"></div>
          </div>
        </div>

        {/* Capabilities */}
        <div className="capabilities" ref={addToRefs}>
          <h2 className="capabilities-title">
            What <span className="capabilities-title-accent">Vesta</span> sees
          </h2>

          <div className="capabilities-grid">
            <div className="capability-card">
              <div className="capability-icon" style={{ background: '#CD2C58' }}></div>
              <h3 className="capability-name">Makeup looks</h3>
              <p className="capability-desc">For your skin tone, for any occasion</p>
            </div>

            <div className="capability-card">
              <div className="capability-icon" style={{ background: '#E06B80' }}></div>
              <h3 className="capability-name">Hairstyles</h3>
              <p className="capability-desc">That actually suit your face shape</p>
            </div>

            <div className="capability-card">
              <div className="capability-icon" style={{ background: '#FFC69D' }}></div>
              <h3 className="capability-name">Outfit combinations</h3>
              <p className="capability-desc">Using clothes you already own</p>
            </div>

            <div className="capability-card">
              <div className="capability-icon" style={{ background: '#FFE6D4' }}></div>
              <h3 className="capability-name">Event styling</h3>
              <p className="capability-desc">Bridesmaid. Party. Date. Work.</p>
            </div>
          </div>
        </div>

        {/* The Question */}
        <div className="question-block" ref={addToRefs}>
          <div className="question-card">
            <span className="question-mark">?</span>
            <p className="question-text">
              What should I wear?
            </p>
            <div className="question-line"></div>
          </div>
        </div>

        {/* Answer */}
        <div className="answer-block" ref={addToRefs}>
          <div className="answer-card">
            <span className="answer-mark">!</span>
            <p className="answer-text">
              Vesta knows.
            </p>
          </div>
        </div>

        {/* Inspiration */}
        <div className="inspiration" ref={addToRefs}>
          <div className="inspiration-strip">
            <span className="inspiration-item">Bridal</span>
            <span className="inspiration-item">•</span>
            <span className="inspiration-item">Festive</span>
            <span className="inspiration-item">•</span>
            <span className="inspiration-item">Casual</span>
            <span className="inspiration-item">•</span>
            <span className="inspiration-item">Nails</span>
            <span className="inspiration-item">•</span>
            <span className="inspiration-item">Hair</span>
            <span className="inspiration-item">•</span>
            <span className="inspiration-item">Makeup</span>
            <span className="inspiration-item">•</span>
            <span className="inspiration-item">Men</span>
            <span className="inspiration-item">•</span>
            <span className="inspiration-item">Women</span>
            <span className="inspiration-item">•</span>
            <span className="inspiration-item">Soft glam</span>
            <span className="inspiration-item">•</span>
            <span className="inspiration-item">Braids</span>
            <span className="inspiration-item">•</span>
            <span className="inspiration-item">Ethnic</span>
          </div>
          <p className="inspiration-caption">Thousands of images. Every style. Every gender.</p>
        </div>

        {/* Promise */}
        <div className="promise" ref={addToRefs}>
          <p className="promise-text">
            Your digital wardrobe. Your personal stylist. Always with you.
          </p>
        </div>

        {/* Final */}
        <div className="about-final" ref={addToRefs}>
          <Link to="/register" className="final-button">
            <span>Start seeing your style</span>
            <span className="final-button-arrow">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;