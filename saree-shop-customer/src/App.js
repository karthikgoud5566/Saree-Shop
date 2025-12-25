import React, { useState, useEffect } from 'react';
import SareeDetails from './pages/SareeDetails';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// useNavigate, useLocation
import Header from './components/Header';
import Footer from './components/Footer';
// import LandingPage from './pages/LandingPage';
import ProductCatalog from './components/ProductCatalog';
import ShoppingCart from './pages/ShoppingCart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import CustomerAuth from './components/CustomerAuth';
import customerAuthService from './services/customerAuthService';
import About from './pages/About';
import Contact from './pages/contact';
import Home from './pages/Home';



import './App.css';

function App() {
  const [cart, setCart] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingCartItem, setPendingCartItem] = useState(null); // Store item to add after login

  // Load cart from localStorage and check authentication on app start
  useEffect(() => {
    const savedCart = localStorage.getItem('sareeShopCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    checkAuthentication();
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('sareeShopCart', JSON.stringify(cart));
  }, [cart]);

  const checkAuthentication = () => {
    if (customerAuthService.isAuthenticated()) {
      setIsAuthenticated(true);
      setUser(customerAuthService.getUser());
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  };

  const addToCartActual = (saree) => {
    const existingItem = cart.find(item => item.id === saree.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === saree.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...saree, quantity: 1 }]);
    }

    // Clear pending item
    setPendingCartItem(null);
  };

  const handleAddToCart = (saree, navigate) => {
    // If authenticated, add directly
    if (isAuthenticated) {
      addToCartActual(saree);
      return;
    }

    // If not authenticated, store item and redirect to login
    setPendingCartItem(saree);
    
    // Store the current page URL for redirect after login
    const currentPath = window.location.pathname + window.location.search;
    localStorage.setItem('redirectAfterLogin', currentPath);
    
    // Navigate to login
    navigate('/login');
  };

  const updateCart = (sareeId, newQuantity) => {
    setCart(cart.map(item => 
      item.id === sareeId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromCart = (sareeId) => {
    setCart(cart.filter(item => item.id !== sareeId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);

    // If there's a pending cart item, add it now
    if (pendingCartItem) {
      addToCartActual(pendingCartItem);
      
      // Show success message
      setTimeout(() => {
        alert(`${pendingCartItem.title} has been added to your cart!`);
      }, 500);
    }
  };

  const handleLogout = () => {
    customerAuthService.logout();
    setIsAuthenticated(false);
    setUser(null);
    clearCart(); // Clear cart on logout
    setPendingCartItem(null); // Clear pending item
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    return children;
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Header 
          cartCount={cartCount} 
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={handleLogout}
        />
        
        <main>
          <Routes>
            {/* <Route path="/" element={<LandingPage />} /> */}
            <Route path="/" element={<Home />} />
            <Route 
              path="/sarees" 
              element={
                <ProductCatalog 
                  onAddToCart={handleAddToCart}
                  isAuthenticated={isAuthenticated}
                />
              } 
            />
            <Route path="/login" element={
              isAuthenticated ? 
                <Navigate to="/" replace /> : 
                <CustomerAuth mode="login" onSuccess={handleLogin} />
            } />
            <Route path="/signup" element={
              isAuthenticated ? 
                <Navigate to="/" replace /> : 
                <CustomerAuth mode="signup" onSuccess={handleLogin} />
            } />
            <Route 
              path="/cart" 
              element={
                <ProtectedRoute>
                  <ShoppingCart 
                    cart={cart}
                    updateCart={updateCart}
                    removeFromCart={removeFromCart}
                    clearCart={clearCart}
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute>
                  <Checkout 
                    cart={cart}
                    clearCart={clearCart}
                  />
                </ProtectedRoute>
              } 
            />
            <Route path="/order-success" element={<OrderSuccess />} />

            <Route 
              path="/saree/:id" 
              element={
                <SareeDetails 
                  onAddToCart={handleAddToCart}
                  isAuthenticated={isAuthenticated}
                />
              } 
            />

            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
