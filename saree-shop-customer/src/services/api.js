import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor for axios requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('customerToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const sareeService = {
  getAllSarees: () => api.get('/sarees'),
  getSareeById: (id) => api.get(`/sarees/${id}`),
};

export const customerService = {
  createCustomer: (customer) => api.post('/customers', customer),
  getCustomerByPhone: (phone) => api.get(`/customers/phone/${phone}`),
};

// ✅ FIXED: Updated orderService with consistent approach
export const orderService = {
  // Test backend connection (no auth required)
  testConnection: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/test`);
      return await response.json();
    } catch (error) {
      throw new Error(`Backend connection failed: ${error.message}`);
    }
  },

  // Create full payment order
  createFullPaymentOrder: async (customerId, sareeIds, quantities, shippingAddress = '') => {
    try {
      console.log('🚀 Creating full payment order:', { customerId, sareeIds, quantities });
      
      const orderData = {
        customerId: customerId,
        shippingAddress: shippingAddress,
        items: sareeIds.map((sareeId, index) => ({
          sareeId: sareeId,
          quantity: quantities[index],
          unitPrice: 0
        }))
      };

      // ✅ FIXED: Use axios instead of fetch for consistency
      const response = await api.post('/orders/full', orderData);
      return { data: response.data };
      
    } catch (error) {
      console.error('Full payment order error:', error);
      
      if (error.response) {
        // Server responded with error status
        throw new Error(error.response.data.message || `HTTP ${error.response.status}`);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('No response from server. Please check if backend is running.');
      } else {
        // Something else happened
        throw new Error(`Request failed: ${error.message}`);
      }
    }
  },

  // Create installment order
  createInstallmentOrder: async (customerId, sareeIds, quantities, advanceAmount, shippingAddress = '') => {
    try {
      console.log('🚀 Creating installment order:', { customerId, sareeIds, quantities, advanceAmount });
      
      const orderData = {
        customerId: customerId,
        shippingAddress: shippingAddress,
        advanceAmount: advanceAmount,
        items: sareeIds.map((sareeId, index) => ({
          sareeId: sareeId,
          quantity: quantities[index],
          unitPrice: 0
        }))
      };

      // ✅ FIXED: Use axios instead of fetch for consistency
      const response = await api.post('/orders/installment', orderData);
      return { data: response.data };
      
    } catch (error) {
      console.error('Installment order error:', error);
      
      if (error.response) {
        throw new Error(error.response.data.message || `HTTP ${error.response.status}`);
      } else if (error.request) {
        throw new Error('No response from server. Please check if backend is running.');
      } else {
        throw new Error(`Request failed: ${error.message}`);
      }
    }
  }
};

export default api;
