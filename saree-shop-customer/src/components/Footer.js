import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Padma Saree Collection</h3>
          <p>Beautiful sarees that celebrate tradition and elegance. Quality craftsmanship for every special occasion.</p>
          {/* <div className="social-links"> */}
            {/* <span>📱 Follow us:</span> */}
            {/* <a href="#" aria-label="Facebook">📘</a> */}
            {/* <a href="#" aria-label="Instagram">📷</a> */}
            {/* <a href="#" aria-label="WhatsApp">💬</a> */}
          {/* </div> */}
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><button onClick={() => navigate('/')}>Home</button></li>
            <li><button onClick={() => navigate('/sarees')}>All Sarees</button></li>
            <li><button onClick={() => navigate('/about')}>About Us</button></li>
            <li><button onClick={() => navigate('/contact')}>Contact</button></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Categories</h4>
          <ul>
            <li><button onClick={() => navigate('/sarees?category=silk')}>Silk Sarees</button></li>
            <li><button onClick={() => navigate('/sarees?category=cotton')}>Cotton Sarees</button></li>
            <li><button onClick={() => navigate('/sarees?category=party')}>Party Wear</button></li>
            <li><button onClick={() => navigate('/sarees?category=wedding')}>Wedding Collection</button></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Customer Service</h4>
          <ul>
            <li>📞 Phone: +91 9121903669</li>
            <li>📧 Email: padmasareecollection@gmail.com</li>
            <li>🕒 Mon-Sun: 10 AM - 8 PM</li>
            <li>📍 Shadnagar,Telangana</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; 2025 Padma Saree Collection. All rights reserved.</p>
          <div className="footer-links">
            <button onClick={() => navigate('/privacy')}>Privacy Policy</button>
            <button onClick={() => navigate('/terms')}>Terms of Service</button>
            <button onClick={() => navigate('/returns')}>Return Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
