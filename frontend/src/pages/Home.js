import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="layout-container">
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>Welcome to Our Cyber Cafe</h1>
            <p>Your one-stop destination for all your computing needs</p>
            <div className="hero-buttons">
              <Link to="/login" className="primary-button">Login</Link>
              <Link to="/register" className="secondary-button">Register</Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2>Our Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <i className="fas fa-desktop"></i>
              <h3>High-Speed Computers</h3>
              <p>Latest hardware with fast internet connectivity for gaming and work</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-print"></i>
              <h3>Printing Services</h3>
              <p>High-quality printing, scanning, and photocopying services</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-gamepad"></i>
              <h3>Gaming Zone</h3>
              <p>Dedicated gaming stations with latest games and accessories</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-wifi"></i>
              <h3>Fast Internet</h3>
              <p>High-speed internet connection for seamless browsing</p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="pricing-section">
          <h2>Our Pricing</h2>
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3>Browsing</h3>
              <p className="price">₹60/hour</p>
              <ul>
                <li><i className="fas fa-check"></i> Basic Computer Usage</li>
                <li><i className="fas fa-check"></i> Internet Access</li>
                <li><i className="fas fa-check"></i> Basic Software</li>
              </ul>
            </div>
            <div className="pricing-card featured">
              <h3>Gaming</h3>
              <p className="price">₹100/hour</p>
              <ul>
                <li><i className="fas fa-check"></i> High-End Gaming PC</li>
                <li><i className="fas fa-check"></i> Latest Games</li>
                <li><i className="fas fa-check"></i> Gaming Accessories</li>
              </ul>
            </div>
            <div className="pricing-card">
              <h3>Academic</h3>
              <p className="price">₹40/hour</p>
              <ul>
                <li><i className="fas fa-check"></i> Professional Software</li>
                <li><i className="fas fa-check"></i> Quiet Environment</li>
                <li><i className="fas fa-check"></i> Printing Service</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <h2>Visit Us</h2>
          <div className="contact-info">
            <div className="contact-card">
              <i className="fas fa-map-marker-alt"></i>
              <h3>Location</h3>
              <p>123 Cyber Street, Digital City</p>
            </div>
            <div className="contact-card">
              <i className="fas fa-clock"></i>
              <h3>Hours</h3>
              <p>Open Daily: 9:00 AM - 9:00 PM</p>
            </div>
            <div className="contact-card">
              <i className="fas fa-phone"></i>
              <h3>Contact</h3>
              <p>+91 98765 43210</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home; 