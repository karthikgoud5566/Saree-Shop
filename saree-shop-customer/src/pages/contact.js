import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
  const navigate = useNavigate();

  // handle (fake) form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you! We will call you within 24 hours.');
    e.target.reset();
  };

  return (
    <div className="contact-page">
      {/* ---------- HERO ---------- */}
      <section className="contact-hero">
        <h1>Get in Touch</h1>
        <p>
          Questions about sarees, installment plans, or delivery?  
          Padma is just a phone call away!
        </p>
        <button onClick={() => window.location.href = 'tel:+919000917804'}>
          📞  Call Padma Now
        </button>
      </section>

      {/* ---------- INFO GRID ---------- */}
      <section className="contact-info container">
        <div className="info-card">
          <span className="info-icon">👩‍🦳</span>
          <h3>Owner</h3>
          <p>Padma</p>
        </div>

        <div className="info-card">
          <span className="info-icon">📞</span>
          <h3>Phone</h3>
          <p>
            <a href="tel:+919000917804">+91 90009 17804</a><br/>
            Mon-Sat 10 AM – 8 PM
          </p>
        </div>

        <div className="info-card">
          <span className="info-icon">📍</span>
          <h3>Address</h3>
          <p>
            Eshwar Colony, Shadnagar<br/>
            Telangana 509216
          </p>
        </div>

        <div className="info-card">
          <span className="info-icon">✉️</span>
          <h3>Email</h3>
          <p>
            <a href="mailto:info@sareeshop.com">info@sareeshop.com</a>
          </p>
        </div>
      </section>

      {/* ---------- QUICK MESSAGE FORM ---------- */}
      <section className="contact-form-section">
        <div className="container form-grid">
          <div className="form-text">
            <h2>Send Us a Message</h2>
            <p>
              Prefer typing? Leave your details below and Padma will call you back
              within 24 hours.
            </p>
            <button className="browse-btn" onClick={() => navigate('/sarees')}>
              🛍️  Browse Sarees
            </button>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone Number"
              required
            />
            <textarea
              name="message"
              placeholder="How can we help you?"
              rows="4"
              required
            ></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>
      </section>

      {/* ---------- GOOGLE MAP ---------- */}
      <section className="map-section">
        
        <iframe
          title="shop-location"
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}&q=Eshwar+Colony+Shadnagar+Telangana`}

        ></iframe>
      </section>
    </div>
  );
};

export default Contact;
