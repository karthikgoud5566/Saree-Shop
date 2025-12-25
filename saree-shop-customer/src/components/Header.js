import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import Drawer from '@mui/material/Drawer';
import './Header.css';

const Header = ({ cartCount, isAuthenticated, user, onLogout }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="saree-header">
      {/* Logo Section */}
      <div className="brand-section">
        <Link to="/" className="brand-link">
          <div className="logo-container">
            <span className="saree-icon">🌺</span>
            <div className="brand-info">
              <span className="brand-name">Padma</span>
              <span className="brand-tagline">Saree Collection</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Desktop Navigation */}
      {!isMobile && (
        <nav className="desktop-nav">
          <Link to="/" className="nav-item">
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </Link>
          <Link to="/sarees" className="nav-item featured">
            <span className="nav-icon">👗</span>
            <span>Sarees</span>
          </Link>
          <Link to="/about" className="nav-item">
            <span className="nav-icon">💫</span>
            <span>About</span>
          </Link>
          <Link to="/contact" className="nav-item">
            <span className="nav-icon">📞</span>
            <span>Contact</span>
          </Link>
        </nav>
      )}

      {/* Right Actions */}
      <div className="header-right">
        {/* User Welcome */}
        {isAuthenticated && !isMobile && (
          <div className="user-welcome">
            <span className="welcome-text">Welcome,</span>
            <span className="user-name">{user?.name || 'Beautiful'}</span>
            <span className="namaste-icon">🙏</span>
          </div>
        )}

        {/* Cart Button */}
        <button className="cart-btn" onClick={() => navigate('/cart')}>
          <div className="cart-container">
            <span className="cart-emoji">🛍️</span>
            <div className="cart-details">
              <span className="cart-label">My Cart</span>
              <span className="item-count">{cartCount} items</span>
            </div>
            {cartCount > 0 && (
              <div className="cart-notification">{cartCount}</div>
            )}
          </div>
        </button>

        {/* Logout Button */}
        {isAuthenticated && !isMobile && (
          <button className="logout-btn" onClick={onLogout}>
            <span>👋</span>
            <span>Logout</span>
          </button>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <button className="mobile-menu-btn" onClick={() => setOpen(true)}>
            <div className="menu-bars">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        )}
      </div>

      {/* Mobile Drawer */}

      {/* Mobile Drawer - FIXED VERSION */}
<Drawer 
  anchor="right" 
  open={open} 
  onClose={() => setOpen(false)}
  PaperProps={{ className: 'mobile-drawer' }}
>
  <div className="drawer-content">
    {/* Drawer Header */}
    <div className="drawer-header">
      <div className="drawer-brand">
        <span className="drawer-icon">🌺</span>
        <span className="drawer-title">Menu</span>
      </div>
      <button className="close-drawer" onClick={() => setOpen(false)}>
        ✕
      </button>
    </div>

    {/* User Section in Mobile */}
    {isAuthenticated && (
      <div className="mobile-user-section">
        <div className="mobile-avatar">👤</div>
        <div className="mobile-user-info">
          <span className="mobile-welcome">Welcome back!</span>
          <span className="mobile-username">{user?.name || 'Beautiful Customer'}</span>
        </div>
      </div>
    )}

    {/* Navigation Links */}
    <div className="drawer-nav">
      <Link to="/" className="drawer-link" onClick={() => setOpen(false)}>
        <span className="drawer-link-icon">🏠</span>
        <span>Home</span>
      </Link>
      <Link to="/sarees" className="drawer-link special" onClick={() => setOpen(false)}>
        <span className="drawer-link-icon">👗</span>
        <span>Beautiful Sarees</span>
        <span className="special-badge">Popular</span>
      </Link>
      <Link to="/about" className="drawer-link" onClick={() => setOpen(false)}>
        <span className="drawer-link-icon">💫</span>
        <span>Our Story</span>
      </Link>
      <Link to="/contact" className="drawer-link" onClick={() => setOpen(false)}>
        <span className="drawer-link-icon">📞</span>
        <span>Contact Padma</span>
      </Link>
    </div>

    {/* Cart Link in Mobile Menu */}
    <div className="drawer-cart-section">
      <Link to="/cart" className="drawer-cart-link" onClick={() => setOpen(false)}>
        <span className="drawer-link-icon">🛍️</span>
        <span>My Cart ({cartCount})</span>
      </Link>
    </div>

    {/* Drawer Footer */}
    {isAuthenticated && (
      <div className="drawer-footer">
        <button className="drawer-logout" onClick={onLogout}>
          <span>👋</span>
          <span>Logout</span>
        </button>
      </div>
    )}
  </div>
</Drawer>



{/* Mobile Drawer - FIXED VERSION */}
<Drawer 
  anchor="right" 
  open={open} 
  onClose={() => setOpen(false)}
  PaperProps={{ className: 'mobile-drawer' }}
>
  <div className="drawer-content">
    {/* Drawer Header */}
    <div className="drawer-header">
      <div className="drawer-brand">
        <span className="drawer-icon">🌺</span>
        <span className="drawer-title">Menu</span>
      </div>
      <button className="close-drawer" onClick={() => setOpen(false)}>
        ✕
      </button>
    </div>

    {/* User Section in Mobile */}
    {isAuthenticated && (
      <div className="mobile-user-section">
        <div className="mobile-avatar">👤</div>
        <div className="mobile-user-info">
          <span className="mobile-welcome">Welcome back!</span>
          <span className="mobile-username">{user?.name || 'Beautiful Customer'}</span>
        </div>
      </div>
    )}

    {/* Navigation Links */}
    <div className="drawer-nav">
      <Link to="/" className="drawer-link" onClick={() => setOpen(false)}>
        <span className="drawer-link-icon">🏠</span>
        <span>Home</span>
      </Link>
      <Link to="/sarees" className="drawer-link special" onClick={() => setOpen(false)}>
        <span className="drawer-link-icon">👗</span>
        <span>Beautiful Sarees</span>
        <span className="special-badge">Popular</span>
      </Link>
      <Link to="/about" className="drawer-link" onClick={() => setOpen(false)}>
        <span className="drawer-link-icon">💫</span>
        <span>Our Story</span>
      </Link>
      <Link to="/contact" className="drawer-link" onClick={() => setOpen(false)}>
        <span className="drawer-link-icon">📞</span>
        <span>Contact Padma</span>
      </Link>
    </div>

    {/* Cart Link in Mobile Menu */}
    <div className="drawer-cart-section">
      <Link to="/cart" className="drawer-cart-link" onClick={() => setOpen(false)}>
        <span className="drawer-link-icon">🛍️</span>
        <span>My Cart ({cartCount})</span>
      </Link>
    </div>

    {/* Drawer Footer */}
    {isAuthenticated && (
      <div className="drawer-footer">
        <button className="drawer-logout" onClick={onLogout}>
          <span>👋</span>
          <span>Logout</span>
        </button>
      </div>
    )}
  </div>
</Drawer>



{/* Mobile Drawer - FIXED VERSION */}
<Drawer 
  anchor="right" 
  open={open} 
  onClose={() => setOpen(false)}
  PaperProps={{ className: 'mobile-drawer' }}
>
  <div className="drawer-content">
    {/* Drawer Header */}
    <div className="drawer-header">
      <div className="drawer-brand">
        <span className="drawer-icon">🌺</span>
        <span className="drawer-title">Menu</span>
      </div>
      <button className="close-drawer" onClick={() => setOpen(false)}>
        ✕
      </button>
    </div>

    {/* User Section in Mobile */}
    {isAuthenticated && (
      <div className="mobile-user-section">
        <div className="mobile-avatar">👤</div>
        <div className="mobile-user-info">
          <span className="mobile-welcome">Welcome back!</span>
          <span className="mobile-username">{user?.name || 'Beautiful Customer'}</span>
        </div>
      </div>
    )}

    {/* Navigation Links */}
    <div className="drawer-nav">
      <Link to="/" className="drawer-link" onClick={() => setOpen(false)}>
        <span className="drawer-link-icon">🏠</span>
        <span>Home</span>
      </Link>
      <Link to="/sarees" className="drawer-link special" onClick={() => setOpen(false)}>
        <span className="drawer-link-icon">👗</span>
        <span>Beautiful Sarees</span>
        <span className="special-badge">Popular</span>
      </Link>
      <Link to="/about" className="drawer-link" onClick={() => setOpen(false)}>
        <span className="drawer-link-icon">💫</span>
        <span>Our Story</span>
      </Link>
      <Link to="/contact" className="drawer-link" onClick={() => setOpen(false)}>
        <span className="drawer-link-icon">📞</span>
        <span>Contact Padma</span>
      </Link>
    </div>

    {/* Cart Link in Mobile Menu */}
    <div className="drawer-cart-section">
      <Link to="/cart" className="drawer-cart-link" onClick={() => setOpen(false)}>
        <span className="drawer-link-icon">🛍️</span>
        <span>My Cart ({cartCount})</span>
      </Link>
    </div>

    {/* Drawer Footer */}
    {isAuthenticated && (
      <div className="drawer-footer">
        <button className="drawer-logout" onClick={onLogout}>
          <span>👋</span>
          <span>Logout</span>
        </button>
      </div>
    )}
  </div>
</Drawer>



{/* Mobile Drawer - FIXED VERSION */}
<Drawer 
  anchor="right" 
  open={open} 
  onClose={() => setOpen(false)}
  PaperProps={{ className: 'mobile-drawer' }}
>
  <div className="drawer-content">
    {/* Drawer Header */}
    <div className="drawer-header">
      <div className="drawer-brand">
        <span className="drawer-icon">🌺</span>
        <span className="drawer-title">Menu</span>
      </div>
      <button className="close-drawer" onClick={() => setOpen(false)}>
        ✕
      </button>
    </div>

    {/* User Section in Mobile */}
    {isAuthenticated && (
      <div className="mobile-user-section">
        <div className="mobile-avatar">👤</div>
        <div className="mobile-user-info">
          <span className="mobile-welcome">Welcome back!</span>
          <span className="mobile-username">{user?.name || 'Beautiful Customer'}</span>
        </div>
      </div>
    )}

    {/* Navigation Links */}
    <div className="drawer-nav">
      <Link to="/" className="drawer-link" onClick={() => setOpen(false)}>
        <span className="drawer-link-icon">🏠</span>
        <span>Home</span>
      </Link>
      <Link to="/sarees" className="drawer-link special" onClick={() => setOpen(false)}>
        <span className="drawer-link-icon">👗</span>
        <span>Beautiful Sarees</span>
        <span className="special-badge">Popular</span>
      </Link>
      <Link to="/about" className="drawer-link" onClick={() => setOpen(false)}>
        <span className="drawer-link-icon">💫</span>
        <span>Our Story</span>
      </Link>
      <Link to="/contact" className="drawer-link" onClick={() => setOpen(false)}>
        <span className="drawer-link-icon">📞</span>
        <span>Contact Padma</span>
      </Link>
    </div>

    {/* Cart Link in Mobile Menu */}
    <div className="drawer-cart-section">
      <Link to="/cart" className="drawer-cart-link" onClick={() => setOpen(false)}>
        <span className="drawer-link-icon">🛍️</span>
        <span>My Cart ({cartCount})</span>
      </Link>
    </div>

    {/* Drawer Footer */}
    {isAuthenticated && (
      <div className="drawer-footer">
        <button className="drawer-logout" onClick={onLogout}>
          <span>👋</span>
          <span>Logout</span>
        </button>
      </div>
    )}
  </div>
</Drawer>

    </header>
  );
};

export default Header;
