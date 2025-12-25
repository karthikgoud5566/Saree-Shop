import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'http://localhost:8080/api';

class CustomerAuthService {
  constructor() {
    this.token = localStorage.getItem('customerToken');
    this.setupAxiosInterceptors();
  }

  setupAxiosInterceptors() {
    // Add token to requests that need authentication
    axios.interceptors.request.use(
      (config) => {
        // Only add token for customer-specific endpoints
        if (this.isProtectedEndpoint(config.url)) {
          const token = this.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle token expiration
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && this.isAuthenticated()) {
          this.logout();
          // Redirect to login instead of page reload for better UX
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  isProtectedEndpoint(url) {
    const protectedPaths = ['/orders/full', '/orders/installment', '/orders/my-orders'];
    return protectedPaths.some(path => url.includes(path));
  }

  async signup(userData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
      const { token, role, name, userId, customerId } = response.data;

      // Verify it's a customer token
      if (role !== 'CUSTOMER') {
        throw new Error('Customer registration failed');
      }

      // Store token and user data
      localStorage.setItem('customerToken', token);
      localStorage.setItem('customerUser', JSON.stringify({
        name,
        email: userData.email,
        role,
        userId,
        customerId
      }));

      this.token = token;
      return response.data;
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });

      const { token, role, name, userId, customerId } = response.data;

      // Verify it's a customer token
      if (role !== 'CUSTOMER') {
        throw new Error('Customer login failed - Admin accounts cannot shop');
      }

      // Store token and user data
      localStorage.setItem('customerToken', token);
      localStorage.setItem('customerUser', JSON.stringify({
        name,
        email,
        role,
        userId,
        customerId
      }));

      this.token = token;
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerUser');
    localStorage.removeItem('sareeShopCart'); // Clear cart on logout
    this.token = null;
  }

  getToken() {
    return localStorage.getItem('customerToken');
  }

  getUser() {
    const userStr = localStorage.getItem('customerUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  getCustomerId() {
    const user = this.getUser();
    return user?.customerId;
  }

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp < currentTime) {
        this.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  isCustomer() {
    const user = this.getUser();
    return user?.role === 'CUSTOMER';
  }
}

const customerAuthService = new CustomerAuthService();
export default customerAuthService;
