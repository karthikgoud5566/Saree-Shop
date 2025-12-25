import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = ({ cart, clearCart }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  
  // For logged-in users - address management
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [newDeliveryAddress, setNewDeliveryAddress] = useState('');
  
  // ✅ NEW: Special requests field
  const [orderNotes, setOrderNotes] = useState('');

  // ❌ REMOVED: Payment-related state variables
  // const [paymentMethod, setPaymentMethod] = useState('installment');
  // const [advanceAmount, setAdvanceAmount] = useState(0);

  const redirectToLogin = useCallback(() => {
    sessionStorage.setItem('pendingCart', JSON.stringify(cart));
    navigate('/login', { 
      state: { 
        redirectTo: '/checkout',
        message: 'Please login to complete your order'
      }
    });
  }, [navigate, cart]);

  const checkAuthenticationAndFetchProfile = useCallback(async () => {
    const token = localStorage.getItem('customerToken');
    if (token) {
      try {
        const response = await fetch('http://localhost:8080/api/customers/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const customer = await response.json();
          setCustomerData(customer);
          setIsLoggedIn(true);
          console.log('✅ Logged-in customer:', customer);
        } else {
          redirectToLogin();
        }
      } catch (error) {
        console.error('Error fetching customer profile:', error);
        redirectToLogin();
      }
    } else {
      redirectToLogin();
    }
  }, [redirectToLogin]);

  useEffect(() => {
    checkAuthenticationAndFetchProfile();
  }, [checkAuthenticationAndFetchProfile]);

  const calculateTotals = () => {
    const subtotal = cart.reduce((total, item) => total + (item.sellingPrice * item.quantity), 0);
    return { subtotal };
  };

  const { subtotal } = calculateTotals();

  const validateStep1 = () => {
    if (isLoggedIn) {
      const hasValidAddress = !useNewAddress ? 
        customerData?.address : 
        newDeliveryAddress.trim().length > 0;
      return customerData && customerData.name && customerData.phoneNumber && hasValidAddress;
    }
    return false;
  };

  // ❌ REMOVED: validateStep2 function (no payment validation needed)

  const handlePlaceOrder = async () => {
    if (!validateStep1()) {
      alert('Please fill all required fields correctly');
      return;
    }

    setLoading(true);
    try {
      if (isLoggedIn && customerData) {
        const shippingAddress = useNewAddress ? newDeliveryAddress : customerData.address;

        // ✅ SIMPLIFIED: Use single order placement endpoint
        const response = await fetch('http://localhost:8080/api/orders/place-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('customerToken')}`
          },
          body: JSON.stringify({
            customerId: customerData.id,
            items: cart.map(item => ({
              sareeId: item.id,
              quantity: item.quantity
            })),
            shippingAddress: shippingAddress,
            notes: orderNotes
          })
        });

        const order = await response.json();

        if (order.success) {
          clearCart();
          navigate('/order-success', { 
            state: { 
              order: order,
              customer: customerData
            }
          });
        } else {
          throw new Error(order.message || 'Order creation failed');
        }
      } else {
        throw new Error('Authentication required to place order');
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout">
        <div className="empty-checkout">
          <h2>Your cart is empty</h2>
          <p>Add some sarees to your cart before checking out.</p>
          <button className="btn-primary" onClick={() => navigate('/sarees')}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (!isLoggedIn && !customerData) {
    return (
      <div className="checkout">
        <div className="loading-checkout">
          <h2>Verifying your account...</h2>
          <p>Please wait while we check your authentication.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <button onClick={() => navigate('/')}>Home</button>
        <span>›</span>
        <button onClick={() => navigate('/cart')}>Cart</button>
        <span>›</span>
        <span>Checkout</span>
      </div>

      {/* ✅ UPDATED: Progress Steps */}
      <div className="checkout-progress">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <span>Delivery Info</span>
        </div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <span>Order Process</span>
        </div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <span>Review & Place Order</span>
        </div>
      </div>

      <div className="checkout-content">
        {/* Step 1: Customer Information */}
        {currentStep === 1 && (
          <div className="checkout-step">
            <h2>Delivery Information</h2>
            
            {isLoggedIn && customerData ? (
              <div className="customer-form">
                {/* Customer Info */}
                <div className="customer-info-section">
                  <h3>👤 Order Details</h3>
                  <div className="readonly-customer-info">
                    <div className="info-row">
                      <strong>Name:</strong> {customerData.name}
                    </div>
                    <div className="info-row">
                      <strong>Phone:</strong> {customerData.phoneNumber}
                    </div>
                    <div className="info-row">
                      <strong>Email:</strong> {customerData.email || 'Not provided'}
                    </div>
                    <div className="profile-update-link">
                      <small>Want to change? <a href="/profile">Update Profile</a></small>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="address-section">
                  <h3>📍 Delivery Address</h3>
                  
                  <div className="address-options">
                    <div className="address-option">
                      <label className="address-radio">
                        <input 
                          type="radio" 
                          name="addressOption"
                          checked={!useNewAddress}
                          onChange={() => setUseNewAddress(false)}
                        />
                        <div className="address-content">
                          <strong>Use Profile Address</strong>
                          <div className="address-text">{customerData.address}</div>
                        </div>
                      </label>
                    </div>

                    <div className="address-option">
                      <label className="address-radio">
                        <input 
                          type="radio" 
                          name="addressOption"
                          checked={useNewAddress}
                          onChange={() => setUseNewAddress(true)}
                        />
                        <div className="address-content">
                          <strong>Deliver to Different Address</strong>
                          <small>Enter a new delivery address</small>
                        </div>
                      </label>
                    </div>
                  </div>

                  {useNewAddress && (
                    <div className="new-address-input">
                      <textarea
                        value={newDeliveryAddress}
                        onChange={(e) => setNewDeliveryAddress(e.target.value)}
                        placeholder="Enter complete delivery address..."
                        rows="3"
                        required
                      />
                    </div>
                  )}
                </div>

                {/* ✅ NEW: Special Requests */}
                <div className="notes-section">
                  <h3>📝 Special Requests (Optional)</h3>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Any special requests or instructions for your order..."
                    rows="2"
                  />
                </div>

                <div className="step-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => setCurrentStep(2)}
                    disabled={!validateStep1()}
                  >
                    Continue to Order Process
                  </button>
                </div>
              </div>
            ) : (
              <div className="customer-form">
                <p className="auth-required">
                  🔐 Please <a href="/login">login</a> to place an order
                </p>
              </div>
            )}
          </div>
        )}

        {/* ✅ NEW: Step 2 - Order Process (Replaces Payment Method) */}
        {currentStep === 2 && (
          <div className="checkout-step">
            <h2>How Your Order Works</h2>
            
            <div className="order-process">
              <div className="process-steps">
                <div className="step completed">
                  <div className="step-number">
                    <span>✓</span>
                  </div>
                  <div className="step-content">
                    <strong>Order Details Confirmed</strong>
                    <p>Your delivery address and saree selection are ready</p>
                  </div>
                </div>
                
                <div className="step active">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <strong>We'll Contact You Soon</strong>
                    <p>Our team will call you within <strong>24 hours</strong> to confirm your order details</p>
                  </div>
                </div>
                
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <strong>Payment & Delivery Discussion</strong>
                    <p>We'll discuss payment options (Cash, UPI, Bank Transfer) and arrange delivery time</p>
                  </div>
                </div>
                
                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <strong>Delivery & Payment</strong>
                    <p>We'll deliver your beautiful saree and collect payment as agreed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="process-highlights">
              <div className="highlight-card">
                <span className="highlight-icon">📞</span>
                <div className="highlight-content">
                  <strong>Personal Service</strong>
                  <p>Direct communication for the best shopping experience</p>
                </div>
              </div>
              
              <div className="highlight-card">
                <span className="highlight-icon">💰</span>
                <div className="highlight-content">
                  <strong>Flexible Payment</strong>
                  <p>Cash, UPI, Bank Transfer - whatever works best for you</p>
                </div>
              </div>
              
              <div className="highlight-card">
                <span className="highlight-icon">🚚</span>
                <div className="highlight-content">
                  <strong>Free Delivery</strong>
                  <p>No delivery charges within city limits</p>
                </div>
              </div>
            </div>

            <div className="contact-info">
              <div className="contact-card">
                <h4>Need to reach us?</h4>
                <p>📱 Phone: <strong>+91-9876543210</strong></p>
                <p>📧 Email: <strong>orders@priyasarees.com</strong></p>
                <p className="note">Feel free to call if you have any questions about your order!</p>
              </div>
            </div>

            <div className="step-actions">
              <button 
                className="btn-secondary"
                onClick={() => setCurrentStep(1)}
              >
                ← Back to Address
              </button>
              <button 
                className="btn-primary"
                onClick={() => setCurrentStep(3)}
              >
                Continue to Review Order
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review and Place Order */}
        {currentStep === 3 && (
          <div className="checkout-step">
            <h2>Review Your Order</h2>
            
            <div className="order-review">
              <div className="customer-summary">
                <h3>Delivery Information</h3>
                <div className="customer-details">
                  <p><strong>Name:</strong> {customerData?.name}</p>
                  <p><strong>Phone:</strong> {customerData?.phoneNumber}</p>
                  {customerData?.email && <p><strong>Email:</strong> {customerData.email}</p>}
                  <p><strong>Address:</strong> {useNewAddress ? newDeliveryAddress : customerData?.address}</p>
                  {orderNotes && <p><strong>Special Requests:</strong> {orderNotes}</p>}
                </div>
              </div>

              <div className="items-summary">
                <h3>Order Items</h3>
                {cart.map(item => (
                  <div key={item.id} className="review-item">
                    <img 
                      src={item.imageUrl || '/images/saree-placeholder.jpg'} 
                      alt={item.title}
                      onError={(e) => {
                        e.target.src = '/images/saree-placeholder.jpg';
                      }}
                    />
                    <div className="item-info">
                      <h4>{item.title}</h4>
                      <p>{item.fabric} • {item.color}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      ₹{(item.sellingPrice * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="payment-summary">
                <h3>Order Summary</h3>
                <div className="summary-line">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="summary-line">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="summary-line total">
                  <span>Total Amount</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                
                {/* ✅ NEW: Order Information */}
                <div className="order-confirmation-note">
                  <div className="note-box">
                    <h4>💰 What Happens Next</h4>
                    <p>After placing your order:</p>
                    <ul>
                      <li>✅ We'll contact you within 24 hours</li>
                      <li>✅ Confirm saree details and delivery time</li>
                      <li>✅ Discuss payment options (Cash, UPI, Bank Transfer)</li>
                      <li>✅ Arrange free delivery within city limits</li>
                    </ul>
                    <p><strong>No payment required now!</strong></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="step-actions">
              <button 
                className="btn-secondary"
                onClick={() => setCurrentStep(2)}
              >
                ← Back to Process Info
              </button>
              <button 
                className="btn-primary place-order"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
            </div>
          </div>
        )}

        {/* ✅ UPDATED: Order Summary Sidebar */}
        <div className="checkout-sidebar">
          <div className="order-summary-card">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cart.map(item => (
                <div key={item.id} className="summary-item">
                  <span>{item.title} × {item.quantity}</span>
                  <span>₹{(item.sellingPrice * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <span>Total: ₹{subtotal.toLocaleString()}</span>
            </div>
            
            {/* ✅ NEW: Contact Information */}
            <div className="contact-info-sidebar">
              <h4>📞 Contact Us</h4>
              <p>Phone: <strong>+91-9876543210</strong></p>
              <p>We'll call you soon after your order!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
