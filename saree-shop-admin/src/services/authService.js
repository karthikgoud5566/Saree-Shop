import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'http://localhost:8080/api';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('adminToken');
    this.setupAxiosInterceptors();
  }

  setupAxiosInterceptors() {
    // Add token to all requests
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle token expiration
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.reload();
        }
        return Promise.reject(error);
      }
    );
  }

  async login(email, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });

      const { token, role, name, userId } = response.data;

      // Verify it's an admin token
      if (role !== 'ADMIN') {
        throw new Error('Admin access required');
      }

      // Store token
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify({
        name,
        email,
        role,
        userId
      }));

      this.token = token;
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    this.token = null;
  }

  getToken() {
    return localStorage.getItem('adminToken');
  }

  getUser() {
    const userStr = localStorage.getItem('adminUser');
    return userStr ? JSON.parse(userStr) : null;
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

  isAdmin() {
    const user = this.getUser();
    return user?.role === 'ADMIN';
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;
