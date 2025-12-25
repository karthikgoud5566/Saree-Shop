import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 'silk',
      title: 'Silk Sarees',
      description: 'Elegant silk sarees for special occasions',
      image: '/images/silk-sarees.jpg',
      filter: 'silk'
    },
    {
      id: 'cotton',
      title: 'Cotton Sarees',
      description: 'Comfortable cotton sarees for daily wear',
      image: '/images/cotton-sarees.jpg',
      filter: 'cotton'
    },
    {
      id: 'party',
      title: 'Party Wear',
      description: 'Stunning sarees for celebrations',
      image: '/images/party-sarees.jpg',
      filter: 'party'
    },
    {
      id: 'wedding',
      title: 'Wedding Collection',
      description: 'Bridal and wedding sarees',
      image: '/images/wedding-sarees.jpg',
      filter: 'wedding'
    }
  ];

  const handleCategoryClick = (filter) => {
    navigate(`/sarees?category=${filter}`);
  };

  const handleViewAllSarees = () => {
    navigate('/sarees');
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Welcome to Priya's Saree Collection</h1>
            <p>Discover beautiful sarees that celebrate tradition and elegance</p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={handleViewAllSarees}>
                Shop All Sarees
              </button>
              <button className="btn-secondary" onClick={() => navigate('/about')}>
                Our Story
              </button>
            </div>
          </div>
          <div className="hero-image">
            <img src="/images/hero-saree.jpg" alt="Beautiful Saree Collection" />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2>Shop by Category</h2>
          <p>Find the perfect saree for every occasion</p>
          
          <div className="categories-grid">
            {categories.map(category => (
              <div 
                key={category.id} 
                className="category-card"
                onClick={() => handleCategoryClick(category.filter)}
              >
                <div className="category-image">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    onError={(e) => {
                      e.target.src = '/images/saree-placeholder.jpg';
                    }}
                  />
                </div>
                <div className="category-info">
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                  <span className="category-link">Explore Collection →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose Priya's Saree Collection?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🛍️</div>
              <h3>Premium Quality</h3>
              <p>Handpicked sarees with finest fabrics and craftsmanship</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Flexible Payment</h3>
              <p>Pay in full or choose convenient installment options</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Quick and secure delivery to your doorstep</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📞</div>
              <h3>Personal Service</h3>
              <p>Dedicated customer support for all your needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Find Your Perfect Saree?</h2>
            <p>Browse our complete collection and discover sarees that make you feel beautiful</p>
            <button className="btn-primary" onClick={handleViewAllSarees}>
              Explore All Sarees
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
