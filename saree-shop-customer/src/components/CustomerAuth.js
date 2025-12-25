import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import customerAuthService from '../services/customerAuthService';
import './CustomerAuth.css';

const CustomerAuth = ({ mode = 'login', onSuccess }) => {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      if (isLogin) {
        response = await customerAuthService.login(formData.email, formData.password);
      } else {
        response = await customerAuthService.signup(formData);
      }

      console.log('Authentication successful:', response);
      
      // Call success callback
      onSuccess(response);

      // Check for redirect URL
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectUrl);
      } else {
        // Default: redirect to home page
        navigate('/');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      
      if (error.response?.status === 401) {
        setError('Invalid email or password');
      } else if (error.response?.status === 400) {
        setError('This email or phone number is already registered');
      } else if (error.message.includes('Admin accounts')) {
        setError('Admin accounts cannot shop. Please use customer login.');
      } else {
        setError(isLogin ? 'Login failed. Please try again.' : 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      address: ''
    });
  };

  return (
    <div className="customer-auth">
      <div className="auth-container">
        <div className="auth-header">
          <h1>🛍️ Priya's Saree Collection</h1>
          <h2>{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
          <p>
            {isLogin 
              ? 'Please log in to continue shopping' 
              : 'Join us to start your saree shopping journey'
            }
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required={!isLogin}
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={isLogin ? "Enter your password" : "Create a password"}
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required={!isLogin}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your complete address for delivery"
                  required={!isLogin}
                  disabled={loading}
                  rows="3"
                />
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                {isLogin ? 'Logging in...' : 'Creating Account...'}
              </>
            ) : (
              isLogin ? 'Login to Shop' : 'Create Account'
            )}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              className="toggle-button"
              onClick={toggleMode}
              disabled={loading}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>

        <div className="auth-info">
          <div className="info-section">
            <h3>Why Create an Account?</h3>
            <ul>
              <li>🛒 Save items in your cart</li>
              <li>📦 Track your orders</li>
              <li>💳 Choose installment payments</li>
              <li>⚡ Faster checkout process</li>
            </ul>
          </div>
          
          <div className="security-note">
            <span className="security-icon">🔒</span>
            <p>Your personal information is protected with bank-level security</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAuth;
