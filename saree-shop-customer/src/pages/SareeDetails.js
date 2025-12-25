import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sareeService } from '../services/api';
import './SareeDetails.css';

const SareeDetails = ({ onAddToCart, isAuthenticated }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saree, setSaree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchSareeDetails = async () => {
      try {
        setLoading(true);
        const response = await sareeService.getSareeById(id);
        setSaree(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching saree details:', error);
        setLoading(false);
      }
    };

    fetchSareeDetails();
  }, [id]);

  const handleAddToCart = () => {
    setAddingToCart(true);
    
    // Add the saree with selected quantity
    const sareeWithQuantity = { ...saree, requestedQuantity: quantity };
    
    setTimeout(() => {
      onAddToCart(sareeWithQuantity, navigate);
      setAddingToCart(false);
      
      if (isAuthenticated) {
        showNotification(`${quantity} ${saree.title} added to cart!`);
      }
    }, 500);
  };

  const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const updateQuantity = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= saree?.stockQuantity) {
      setQuantity(newQuantity);
    }
  };

  // ❌ REMOVED: calculateInstallmentOptions function

  if (loading) {
    return (
      <div className="saree-details">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading saree details...</p>
        </div>
      </div>
    );
  }

  if (!saree) {
    return (
      <div className="saree-details">
        <div className="error-container">
          <h2>Saree not found</h2>
          <p>The saree you're looking for doesn't exist or has been removed.</p>
          <button className="btn-primary" onClick={() => navigate('/sarees')}>
            Browse All Sarees
          </button>
        </div>
      </div>
    );
  }

  // ❌ REMOVED: installmentOptions calculation
  const totalPrice = saree.sellingPrice * quantity;

  return (
    <div className="saree-details">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <button onClick={() => navigate('/')}>Home</button>
        <span>›</span>
        <button onClick={() => navigate('/sarees')}>Sarees</button>
        <span>›</span>
        <span>{saree.title}</span>
      </div>

      <div className="details-container">
        {/* Product Images */}
        <div className="product-images">
          <div className="main-image">
            <img 
              src={saree.imageUrl || '/images/saree-placeholder.jpg'} 
              alt={saree.title}
              onError={(e) => {
                e.target.src = '/images/saree-placeholder.jpg';
              }}
            />
            {saree.stockQuantity < 5 && saree.stockQuantity > 0 && (
              <span className="stock-badge low-stock">Only {saree.stockQuantity} left!</span>
            )}
            {saree.stockQuantity === 0 && (
              <span className="stock-badge out-of-stock">Out of Stock</span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h1>{saree.title}</h1>
          
          <div className="product-meta">
            <div className="meta-item">
              <span className="label">Fabric:</span>
              <span className="value">{saree.fabric}</span>
            </div>
            <div className="meta-item">
              <span className="label">Color:</span>
              <span className="value">{saree.color}</span>
            </div>
            <div className="meta-item">
              <span className="label">Availability:</span>
              <span className={`value ${saree.stockQuantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {saree.stockQuantity > 0 ? `${saree.stockQuantity} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>

          <div className="pricing">
            <div className="price-section">
              <span className="current-price">₹{saree.sellingPrice.toLocaleString()}</span>
              <span className="price-label">per piece</span>
            </div>
            {quantity > 1 && (
              <div className="total-price">
                <span>Total: ₹{totalPrice.toLocaleString()}</span>
              </div>
            )}
          </div>

          {saree.description && (
            <div className="description">
              <h3>Description</h3>
              <p>{saree.description}</p>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="quantity-section">
            <h3>Quantity</h3>
            <div className="quantity-controls">
              <button 
                className="qty-btn"
                onClick={() => updateQuantity(-1)}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="quantity">{quantity}</span>
              <button 
                className="qty-btn"
                onClick={() => updateQuantity(1)}
                disabled={quantity >= saree.stockQuantity}
              >
                +
              </button>
            </div>
          </div>

          {/* ❌ REMOVED: Payment Options Section */}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className={`btn-primary add-to-cart ${addingToCart ? 'adding' : ''}`}
              onClick={handleAddToCart}
              disabled={saree.stockQuantity === 0 || addingToCart}
            >
              {addingToCart ? (
                <>
                  <span className="spinner"></span>
                  {isAuthenticated ? 'Adding to Cart...' : 'Redirecting...'}
                </>
              ) : saree.stockQuantity === 0 ? (
                'Out of Stock'
              ) : (
                '🛒 Add to Cart'
              )}
            </button>
            
            <button 
              className="btn-secondary"
              onClick={() => navigate('/sarees')}
            >
              ← Continue Shopping
            </button>
          </div>

          {/* Features - Updated to remove payment references */}
          <div className="features">
            <div className="feature">
              <span className="feature-icon">🚚</span>
              <div className="feature-text">
                <strong>Free Delivery</strong>
                <p>Free delivery within city limits</p>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">📞</span>
              <div className="feature-text">
                <strong>Personal Service</strong>
                <p>We'll contact you to confirm your order</p>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">🔄</span>
              <div className="feature-text">
                <strong>Easy Returns</strong>
                <p>7-day return policy for defects</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SareeDetails;
