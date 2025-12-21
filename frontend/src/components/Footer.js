import React from 'react';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>Cyber Cafe provides high-speed internet, modern computers, and printing services in a comfortable environment.</p>
        </div>
        <div className="footer-section">
          <h3>Opening Hours</h3>
          <p>Monday - Friday: 8:00 AM - 10:00 PM</p>
          <p>Saturday - Sunday: 9:00 AM - 8:00 PM</p>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>123 Digital Street</p>
          <p>Tech City, TC 12345</p>
          <p>Phone: +1 234 567 8900</p>
          <p>Email: info@cybercafe.com</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Cyber Cafe. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 