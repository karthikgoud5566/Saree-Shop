import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order, customer } = location.state || {}; // ✅ REMOVED: paymentMethod

  if (!order) {
    return (
      <div className="order-success">
        <div className="error-message">
          <h2>Order not found</h2>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // ✅ ADDED: Safe access to order data
  const orderData = order.order || order; // Handle nested order structure
  const totalAmount = orderData?.totalAmount || 0;
  const orderDate = orderData?.orderDate ? new Date(orderData.orderDate) : new Date();

  return (
    <div className="order-success">
      <div className="success-content">
        <div className="success-icon">✅</div>
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for your order. We'll contact you soon to confirm delivery details.</p>

        <div className="order-details">
          <div className="order-info">
            <h3>Order Information</h3>
            <p><strong>Order ID:</strong> #{orderData?.id || 'Pending'}</p>
            <p><strong>Order Date:</strong> {orderDate.toLocaleDateString()}</p>
            
            {/* ✅ FIXED: Safe number formatting */}
            <p><strong>Total Amount:</strong> ₹{totalAmount.toLocaleString()}</p>
            
            {/* ✅ SIMPLIFIED: No payment method details for offline orders */}
            <p><strong>Payment:</strong> Pay on Delivery</p>
          </div>

          <div className="customer-info">
            <h3>Delivery Details</h3>
            <p><strong>Name:</strong> {customer?.name || 'Not provided'}</p>
            <p><strong>Phone:</strong> {customer?.phoneNumber || 'Not provided'}</p>
            <p><strong>Address:</strong> {customer?.address || 'Not provided'}</p>
          </div>
        </div>

        {/* ✅ UPDATED: Next steps for offline business */}
        <div className="next-steps">
          <h3>What's Next?</h3>
          <ul>
            <li>✅ Our team will contact you within <strong>24 hours</strong> to confirm your order</li>
            <li>✅ We'll discuss delivery time and payment options with you</li>
            <li>✅ Payment can be made via <strong>Cash, UPI, or Bank Transfer</strong></li>
            <li>✅ Free delivery within city limits</li>
            <li>✅ You can call us anytime for order updates</li>
          </ul>
        </div>

        <div className="contact-info">
          <h3>Contact Us</h3>
          <p>📞 Phone: <strong>+91-9876543210</strong></p>
          <p>📧 Email: <strong>orders@priyasarees.com</strong></p>
          <p>🕒 Business Hours: <strong>Mon-Sat 10 AM - 8 PM</strong></p>
          <p className="contact-note">Feel free to call us for any questions about your order!</p>
        </div>

        <div className="success-actions">
          <button className="btn-primary" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
          <button className="btn-secondary" onClick={() => window.print()}>
            Print Order Details
          </button>
        </div>

        {/* ✅ ADDED: Order confirmation note */}
        <div className="confirmation-note">
          <div className="note-box">
            <h4>📝 Important Note</h4>
            <p>Your order has been received and will be processed shortly. No payment is required online - we'll discuss all payment options when we contact you!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
