import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

const About = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('[id]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">
      {/* Hero Section - Maximum Impact */}
      <section className="hero-section" id="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">✨ 12 Years of Trust & Excellence ✨</div>
          <h1 className="hero-title">Your Mom's Saree Collection</h1>
          <p className="hero-subtitle">
            Where every woman's dream of owning beautiful sarees becomes reality
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat">
              <span className="stat-number">12</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Beautiful Sarees</span>
            </div>
          </div>
        </div>
      </section>

      {/* Emotional Story Section */}
      <section className={`story-section ${isVisible.story ? 'animate' : ''}`} id="story">
        <div className="container">
          <div className="story-grid">
            <div className="story-content">
              <div className="section-badge">Our Story</div>
              <h2 className="section-title">A Journey of Passion & Purpose</h2>
              <div className="story-text">
                <p className="highlight-text">
                  <strong>Twelve years ago</strong>, my mother transformed her deep love for sarees 
                  into a heartfelt mission that would change countless women's lives.
                </p>
                <p>
                  With unwavering dedication, she recognized that <strong>every woman deserves 
                  to feel beautiful and elegant</strong>, regardless of her financial circumstances. 
                  Understanding the real challenges faced by homemakers and budget-conscious women, 
                  she pioneered something revolutionary.
                </p>
                <p>
                  <strong>Her vision was simple yet powerful:</strong> bring the finest quality 
                  sarees within everyone's reach through reasonable prices and flexible installment 
                  options. What started as a way to support our family has become a trusted destination 
                  where thousands of women have found their perfect sarees.
                </p>
                <div className="quote-box">
                  <blockquote>
                    "Every woman deserves to shine, and we're here to make that happen - 
                    one beautiful saree at a time."
                  </blockquote>
                </div>
              </div>
            </div>
            <div className="story-visual">
              <div className="image-placeholder">
                <div className="placeholder-text">
                  📸 Your Mom's Photo<br/>
                  (Wearing a Beautiful Saree)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Customer Benefits */}
      <section className={`benefits-section ${isVisible.benefits ? 'animate' : ''}`} id="benefits">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Why Women Love Us</div>
            <h2 className="section-title">What Makes Us Special</h2>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">💰</div>
              <h3>Affordable Luxury</h3>
              <p>Premium quality sarees at prices that won't break your budget. Easy installments available!</p>
              <div className="benefit-highlight">Starting from ₹500/month</div>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">❤️</div>
              <h3>Personal Touch</h3>
              <p>We call you personally to discuss your needs. It's like shopping with family!</p>
              <div className="benefit-highlight">24-hour response guarantee</div>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">👑</div>
              <h3>12 Years Experience</h3>
              <p>Handpicked sarees with an expert eye for quality, authenticity, and style.</p>
              <div className="benefit-highlight">Trusted by 1000+ women</div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & Testimonials */}
      <section className="testimonials-section" id="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"The installment option helped me buy my dream saree for my daughter's wedding. Such caring service!"</p>
              <div className="customer-name">- Sunita ,shadnagar</div>
            </div>
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"Best quality sarees at honest prices. They really understand what women need."</p>
              <div className="customer-name">- Akhila,shadnagar</div>
            </div>
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"12 years of trust! My go-to place for all special occasions. Highly recommended!"</p>
              <div className="customer-name">- Kavitha</div>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency + CTA Section */}
      <section className="cta-section" id="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Find Your Perfect Saree?</h2>
            <p className="cta-subtitle">
              Join 1000+ happy customers who chose us for their special moments. 
              <strong> Limited stock - Don't miss out!</strong>
            </p>
            <div className="cta-buttons">
              <button 
                className="btn-primary"
                onClick={() => navigate('/sarees')}
              >
                🛍️ Shop Now - Free Delivery
              </button>
              <button 
                className="btn-secondary"
                onClick={() => window.location.href = 'tel:+919876543210'}
              >
                📞 Call Now - Get Expert Advice
              </button>
            </div>
            <div className="urgency-text">
              ⚡ <strong>Special Offer:</strong> Free delivery + 10% off on first order this month only!
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="trust-section" id="trust">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <div className="trust-icon">🚚</div>
              <h4>Free Delivery</h4>
              <p>Within city limits</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">💳</div>
              <h4>Easy Payments</h4>
              <p>Cash, UPI, Installments</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">🔄</div>
              <h4>7-Day Returns</h4>
              <p>For any defects</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">📞</div>
              <h4>Personal Service</h4>
              <p>We call you personally</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
