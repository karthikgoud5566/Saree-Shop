import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sareeService } from '../services/api';
import './ProductCatalog.css';

const ProductCatalog = ({ onAddToCart, isAuthenticated }) => {
  const [sarees, setSarees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    fabric: '',
    color: '',
    priceRange: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState('name');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSarees();
    
    // Handle category from URL parameters (from landing page)
    const urlParams = new URLSearchParams(location.search);
    const category = urlParams.get('category');
    if (category) {
      setFilters(prev => ({ ...prev, category, fabric: category === 'silk' || category === 'cotton' ? category : '' }));
    }
  }, [location.search]);

  const fetchSarees = async () => {
    try {
      setLoading(true);
      const response = await sareeService.getAllSarees();
      setSarees(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sarees:', error);
      setLoading(false);
    }
  };

  const filteredSarees = sarees.filter(saree => {
    return (
      (filters.search === '' || 
       saree.title.toLowerCase().includes(filters.search.toLowerCase()) ||
       saree.fabric.toLowerCase().includes(filters.search.toLowerCase()) ||
       saree.color.toLowerCase().includes(filters.search.toLowerCase())) &&
      (filters.fabric === '' || saree.fabric.toLowerCase().includes(filters.fabric.toLowerCase())) &&
      (filters.color === '' || saree.color.toLowerCase().includes(filters.color.toLowerCase())) &&
      (filters.priceRange === '' || checkPriceRange(saree.sellingPrice, filters.priceRange))
    );
  });

  const sortedSarees = [...filteredSarees].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.sellingPrice - b.sellingPrice;
      case 'price-high':
        return b.sellingPrice - a.sellingPrice;
      case 'name':
        return a.title.localeCompare(b.title);
      case 'newest':
        return b.id - a.id;
      default:
        return 0;
    }
  });

  const checkPriceRange = (price, range) => {
    switch (range) {
      case 'under-1000': return price < 1000;
      case '1000-2000': return price >= 1000 && price <= 2000;
      case '2000-3000': return price >= 2000 && price <= 3000;
      case 'above-3000': return price > 3000;
      default: return true;
    }
  };

  const handleAddToCart = async (saree) => {
    setAddingToCart(saree.id);
    
    // Simulate loading for better UX
    setTimeout(() => {
      onAddToCart(saree, navigate);
      setAddingToCart(null);
      
      // Only show notification if user is authenticated (item actually added)
      if (isAuthenticated) {
        showNotification(`${saree.title} added to cart!`);
      }
    }, 500);
  };

  const showNotification = (message) => {
    // Simple notification - you can enhance this later
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4caf50;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 10000;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      fabric: '',
      color: '',
      priceRange: '',
      search: ''
    });
    setShowFilters(false);
  };

  const getCategoryTitle = () => {
    if (filters.category) {
      switch (filters.category) {
        case 'silk': return 'Silk Sarees';
        case 'cotton': return 'Cotton Sarees';
        case 'party': return 'Party Wear';
        case 'wedding': return 'Wedding Collection';
        default: return 'Saree Collection';
      }
    }
    return 'All Sarees';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading beautiful sarees...</p>
      </div>
    );
  }

  return (
    <div className="product-catalog">
      {/* Mobile Search Bar */}
      <div className="mobile-search-bar">
        <input
          type="text"
          placeholder="Search sarees..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
          className="mobile-search-input"
        />
      </div>

      {/* Mobile Filter Header */}
      <div className="mobile-filter-header">
        <div className="results-info">
          <span className="category-title">{getCategoryTitle()}</span>
          <span className="results-count">{sortedSarees.length} Items</span>
        </div>
        <div className="filter-sort-buttons">
          <button 
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <span>🔍</span>
            <span>Filter</span>
          </button>
          <select 
            className="sort-select"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="price-low">Price ↑</option>
            <option value="price-high">Price ↓</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Collapsible Mobile Filters */}
      {showFilters && (
        <div className="mobile-filters">
          <div className="filter-section">
            <label>Fabric</label>
            <div className="filter-chips">
              <button 
                className={`filter-chip ${filters.fabric === '' ? 'active' : ''}`}
                onClick={() => setFilters({...filters, fabric: ''})}
              >
                All
              </button>
              {['silk', 'cotton', 'chiffon', 'georgette'].map(fabric => (
                <button 
                  key={fabric}
                  className={`filter-chip ${filters.fabric === fabric ? 'active' : ''}`}
                  onClick={() => setFilters({...filters, fabric})}
                >
                  {fabric.charAt(0).toUpperCase() + fabric.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <label>Color</label>
            <div className="filter-chips">
              <button 
                className={`filter-chip ${filters.color === '' ? 'active' : ''}`}
                onClick={() => setFilters({...filters, color: ''})}
              >
                All
              </button>
              {['red', 'blue', 'green', 'black', 'yellow', 'pink'].map(color => (
                <button 
                  key={color}
                  className={`filter-chip ${filters.color === color ? 'active' : ''}`}
                  onClick={() => setFilters({...filters, color})}
                >
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <label>Price Range</label>
            <div className="filter-chips">
              <button 
                className={`filter-chip ${filters.priceRange === '' ? 'active' : ''}`}
                onClick={() => setFilters({...filters, priceRange: ''})}
              >
                All
              </button>
              <button 
                className={`filter-chip ${filters.priceRange === 'under-1000' ? 'active' : ''}`}
                onClick={() => setFilters({...filters, priceRange: 'under-1000'})}
              >
                Under ₹1K
              </button>
              <button 
                className={`filter-chip ${filters.priceRange === '1000-2000' ? 'active' : ''}`}
                onClick={() => setFilters({...filters, priceRange: '1000-2000'})}
              >
                ₹1K - ₹2K
              </button>
              <button 
                className={`filter-chip ${filters.priceRange === '2000-3000' ? 'active' : ''}`}
                onClick={() => setFilters({...filters, priceRange: '2000-3000'})}
              >
                ₹2K - ₹3K
              </button>
              <button 
                className={`filter-chip ${filters.priceRange === 'above-3000' ? 'active' : ''}`}
                onClick={() => setFilters({...filters, priceRange: 'above-3000'})}
              >
                Above ₹3K
              </button>
            </div>
          </div>

          <div className="filter-actions">
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear All
            </button>
            <button className="apply-filters-btn" onClick={() => setShowFilters(false)}>
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Products Grid - Mobile Optimized */}
      <div className="products-grid">
        {sortedSarees.map(saree => (
          <div key={saree.id} className="product-card" onClick={() => navigate(`/saree/${saree.id}`)}>
            <div className="product-image-container">
              <img 
                src={saree.imageUrl || '/images/saree-placeholder.jpg'} 
                alt={saree.title}
                className="product-image"
                onError={(e) => {
                  e.target.src = '/images/saree-placeholder.jpg';
                }}
              />
              
              {/* Stock Status Badges */}
              {saree.stockQuantity < 5 && saree.stockQuantity > 0 && (
                <div className="stock-badge low-stock">
                  Only {saree.stockQuantity} left!
                </div>
              )}
              {saree.stockQuantity === 0 && (
                <div className="stock-badge out-of-stock">
                  Out of Stock
                </div>
              )}
              
              {/* Wishlist Button */}
              <button className="wishlist-btn" onClick={(e) => {
                e.stopPropagation();
                // Add wishlist functionality here
              }}>
                ♡
              </button>
            </div>
            
            <div className="product-info">
              <div className="product-brand">Priya's Collection</div>
              <div className="product-name">{saree.title}</div>
              
              <div className="product-details">
                <span className="fabric">{saree.fabric}</span>
                <span className="separator">•</span>
                <span className="color">{saree.color}</span>
              </div>
              
              <div className="product-pricing">
                <span className="current-price">₹{saree.sellingPrice.toLocaleString()}</span>
                <div className="installment-info">
                  ₹{Math.ceil(saree.sellingPrice / 3).toLocaleString()} x 3
                </div>
              </div>
              
              <div className="product-rating">
                <span className="rating">4.3 ⭐</span>
                <span className="rating-count">(127)</span>
              </div>

              {/* Mobile Actions */}
              <div className="mobile-actions">
                <button 
                  className={`add-to-cart-btn ${addingToCart === saree.id ? 'adding' : ''} ${saree.stockQuantity === 0 ? 'disabled' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(saree);
                  }}
                  disabled={saree.stockQuantity === 0 || addingToCart === saree.id}
                >
                  {addingToCart === saree.id ? (
                    <span className="loading-spinner small"></span>
                  ) : saree.stockQuantity === 0 ? (
                    'Out of Stock'
                  ) : (
                    'Add to Cart'
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Products Found */}
      {sortedSarees.length === 0 && (
        <div className="no-products">
          <div className="no-products-icon">🔍</div>
          <h3>No sarees found</h3>
          <p>Try adjusting your filters or search terms</p>
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
