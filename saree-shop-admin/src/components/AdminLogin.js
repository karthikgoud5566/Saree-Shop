import React, { useState } from 'react';
import authService from '../services/authService';
import './AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(credentials.email, credentials.password);
      console.log('Admin login successful:', response);
      onLogin(response);
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        setError('Invalid email or password');
      } else if (error.message === 'Admin access required') {
        setError('Admin access required. Customer accounts cannot access this panel.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-header">
          <h1>🛍️ Priya's Saree Collection</h1>
          <h2>Admin Dashboard</h2>
          <p>Please log in to manage your saree shop</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Enter your admin email"
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
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading || !credentials.email || !credentials.password}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : (
              'Login to Dashboard'
            )}
          </button>
        </form>

        <div className="login-info">
          <div className="info-section">
            <h3>Admin Access Only</h3>
            <p>This dashboard is for business management only. Customers should visit the main website to shop.</p>
          </div>
          
          <div className="security-note">
            <span className="security-icon">🔒</span>
            <p>Your login is secured with enterprise-grade encryption</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
