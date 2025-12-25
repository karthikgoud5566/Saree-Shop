import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [currentBanner, setCurrentBanner] = useState(0);

  // Banner data with actual saree image placeholders
  const banners = [
    {
      id: 1,
      title: "Diwali Special Collection",
      subtitle: "Illuminate your festivities with our exquisite sarees",
      offer: "Up to 40% OFF",
      background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)",
      sareeImage: "https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=400", // Diwali saree
      cta: "Shop Diwali Collection"
    },
    {
      id: 2,
      title: "Wedding Season Arrivals",
      subtitle: "Make your special day unforgettable",
      offer: "New Collection",
      background: "linear-gradient(135deg, #C41E3A 0%, #E91E63 100%)",
      sareeImage: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400", // Bridal saree
      cta: "Explore Bridal Wear"
    },
    {
      id: 3,
      title: "Festive Elegance",
      subtitle: "Traditional beauty meets modern style",
      offer: "Free Delivery",
      background: "linear-gradient(135deg, #6A1B9A 0%, #9C27B0 100%)",
      sareeImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400", // Traditional saree
      cta: "View Collection"
    }
  ];

  // Auto-rotate banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const currentBannerData = banners[currentBanner];

  return (
    <div className="home-page">
      {/* Full Saree Image Banner */}
      <section className="hero-banner" style={{ background: currentBannerData.background }}>
        <div className="hero-content">
          <div className="hero-text">
            <div className="offer-badge">{currentBannerData.offer}</div>
            <h1 className="hero-title">{currentBannerData.title}</h1>
            <p className="hero-subtitle">{currentBannerData.subtitle}</p>
            <button 
              className="hero-cta"
              onClick={() => navigate('/sarees')}
            >
              {currentBannerData.cta}
            </button>
          </div>
          <div className="hero-visual">
            <div className="saree-image-container">
              <img 
                src={currentBannerData.sareeImage}
                alt="Beautiful Saree"
                className="hero-saree-image"
              />
              <div className="saree-overlay"></div>
            </div>
          </div>
        </div>
        
        {/* Navigation Arrows */}
        <button 
          className="banner-nav prev" 
          onClick={() => setCurrentBanner(currentBanner === 0 ? banners.length - 1 : currentBanner - 1)}
        >
          ‹
        </button>
        <button 
          className="banner-nav next" 
          onClick={() => setCurrentBanner((currentBanner + 1) % banners.length)}
        >
          ›
        </button>
        
        {/* Banner Indicators */}
        <div className="banner-indicators">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentBanner ? 'active' : ''}`}
              onClick={() => setCurrentBanner(index)}
            />
          ))}
        </div>
      </section>

      {/* Rest of sections remain the same */}
      <section className="featured-offers">
        <div className="container">
          <h2 className="section-title">Special Offers</h2>
          <div className="offers-grid">
            <div className="offer-card">
              <div className="offer-icon">🎁</div>
              <h3>Free Home Delivery</h3>
              <p>Free delivery across Shadnagar & nearby areas</p>
              <span className="offer-label">Limited Time</span>
            </div>
            <div className="offer-card">
              <div className="offer-icon">💎</div>
              <h3>Premium Quality</h3>
              <p>Hand-picked sarees with guaranteed authenticity</p>
              <span className="offer-label">Always</span>
            </div>
            <div className="offer-card">
              <div className="offer-icon">🏪</div>
              <h3>Visit Our Shop</h3>
              <p>Personal consultation with Padma herself</p>
              <span className="offer-label">Recommended</span>
            </div>
          </div>
        </div>
      </section>

      {/* Collections and other sections remain same as before */}
      <section className="collections-showcase">
        <div className="container">
          <h2 className="section-title">Our Collections</h2>
          <div className="collections-grid">
            <div className="collection-card" onClick={() => navigate('/sarees')}>
              <div className="collection-image">
                <span className="collection-emoji">👗</span>
              </div>
              <div className="collection-info">
                <h3>Traditional Sarees</h3>
                <p>Classic designs for every occasion</p>
                <button className="collection-btn">Explore →</button>
              </div>
            </div>
            <div className="collection-card" onClick={() => navigate('/sarees')}>
              <div className="collection-image">
                <span className="collection-emoji">💐</span>
              </div>
              <div className="collection-info">
                <h3>Bridal Collection</h3>
                <p>Make your wedding day magical</p>
                <button className="collection-btn">Explore →</button>
              </div>
            </div>
            <div className="collection-card" onClick={() => navigate('/sarees')}>
              <div className="collection-image">
                <span className="collection-emoji">✨</span>
              </div>
              <div className="collection-info">
                <h3>Party Wear</h3>
                <p>Shine at every celebration</p>
                <button className="collection-btn">Explore →</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="customer-love">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"Padma aunty has the most beautiful collection! Quality is amazing and prices are very reasonable."</p>
              <div className="customer-name">- Priya M.</div>
            </div>
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"Got my wedding saree from here. Everyone complimented the beautiful work and color combination."</p>
              <div className="customer-name">- Radhika S.</div>
            </div>
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"Excellent service and beautiful sarees. Home delivery was quick and packaging was perfect."</p>
              <div className="customer-name">- Anjali K.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="visit-store">
        <div className="container">
          <div className="visit-content">
            <div className="visit-text">
              <h2>Visit Padma's Saree Collection</h2>
              <p>Experience our beautiful collection in person. Padma is always ready to help you find the perfect saree for any occasion.</p>
              <div className="store-details">
                <div className="detail-item">
                  <span className="detail-icon">📍</span>
                  <span>Eshwar Colony, Shadnagar, Telangana</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📞</span>
                  <span>+91 90009 17804</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🕒</span>
                  <span>Open Daily 10 AM - 8 PM</span>
                </div>
              </div>
              <button 
                className="visit-btn"
                onClick={() => navigate('/contact')}
              >
                Get Directions
              </button>
            </div>
            <div className="visit-visual">
              <div className="shop-icon">🏪</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
