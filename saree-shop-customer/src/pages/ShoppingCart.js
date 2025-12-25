import React  from 'react';
import { useNavigate } from 'react-router-dom';
import './ShoppingCart.css';

const ShoppingCart = ({ cart, updateCart, removeFromCart, clearCart }) => {
  const navigate = useNavigate();

  const updateQuantity = (sareeId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(sareeId);
    } else {
      updateCart(sareeId, newQuantity);
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.sellingPrice * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // ❌ REMOVED: calculateInstallmentOption function
  // ❌ REMOVED: installmentDetails variable

  if (cart.length === 0) {
    return (
      <div className="shopping-cart">
        <div className="empty-cart">
          <div className="empty-cart-content">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any sarees to your cart yet.</p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/sarees')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shopping-cart">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <button onClick={() => navigate('/')}>Home</button>
        <span>›</span>
        <button onClick={() => navigate('/sarees')}>Sarees</button>
        <span>›</span>
        <span>Shopping Cart</span>
      </div>

      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <p>{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
      </div>

      <div className="cart-content">
        {/* Cart Items */}
        <div className="cart-items">
          <div className="cart-items-header">
            <h3>Your Items</h3>
            <button className="clear-cart" onClick={clearCart}>
              Clear All Items
            </button>
          </div>

          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <img 
                  src={item.imageUrl || '/images/saree-placeholder.jpg'} 
                  alt={item.title}
                  onError={(e) => {
                    e.target.src = '/images/saree-placeholder.jpg';
                  }}
                />
              </div>

              <div className="item-details">
                <h4>{item.title}</h4>
                <p className="item-attributes">
                  <span className="fabric">{item.fabric}</span> • 
                  <span className="color">{item.color}</span>
                </p>
                <p className="item-price">₹{item.sellingPrice.toLocaleString()}</p>
                
                {/* ✅ UPDATED: Removed installment preview, added stock info */}
                <div className="item-info">
                  <span className="stock-info">
                    {item.stockQuantity > 5 ? '✅ In Stock' : 
                     item.stockQuantity > 0 ? `⚠️ Only ${item.stockQuantity} left` : '❌ Out of Stock'}
                  </span>
                </div>
              </div>

              <div className="item-controls">
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stockQuantity}
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  <span>₹{(item.sellingPrice * item.quantity).toLocaleString()}</span>
                </div>

                <button 
                  className="remove-item"
                  onClick={() => removeFromCart(item.id)}
                  title="Remove item"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>
            
            <div className="summary-line">
              <span>Subtotal ({getTotalItems()} items)</span>
              <span>₹{calculateSubtotal().toLocaleString()}</span>
            </div>
            
            <div className="summary-line">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            
            <div className="summary-line total">
              <span>Total</span>
              <span>₹{calculateSubtotal().toLocaleString()}</span>
            </div>

            {/* ✅ REPLACED: Payment Options with Order Information */}
            <div className="order-information">
              <h4>Order Information</h4>
              
              <div className="info-card">
                <div className="info-item">
                  <span className="info-icon">📞</span>
                  <div className="info-text">
                    <strong>Personal Service</strong>
                    <p>We'll contact you to confirm your order details</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <span className="info-icon">🚚</span>
                  <div className="info-text">
                    <strong>Free Delivery</strong>
                    <p>Free delivery within city limits</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <span className="info-icon">💰</span>
                  <div className="info-text">
                    <strong>Pay on Delivery</strong>
                    <p>Payment can be made when we deliver your saree</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ REPLACED: Promo Code with Cart Details */}
            <div className="cart-details">
              <h4>Cart Details</h4>
              <div className="cart-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Items:</span>
                  <span className="stat-value">{cart.length} types</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Quantity:</span>
                  <span className="stat-value">{getTotalItems()} pieces</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Average Price:</span>
                  <span className="stat-value">₹{Math.round(calculateSubtotal() / getTotalItems()).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <button 
              className="checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>

            {/* ✅ UPDATED: Secure checkout message */}
            <div className="secure-checkout">
              <span>🔒 Your order will be confirmed after checkout</span>
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="continue-shopping">
            <button 
              className="btn-secondary"
              onClick={() => navigate('/sarees')}
            >
              ← Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
