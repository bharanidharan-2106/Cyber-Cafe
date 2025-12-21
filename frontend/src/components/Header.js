import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));
  const isAdmin = userDetails?.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('userDetails');
    navigate('/login');
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="logo">
          <Link to="/">
            <h1>Cyber Cafe</h1>
          </Link>
          <p className="tagline">Your Digital Hub</p>
        </div>
        <nav className="header-nav">
          {userDetails ? (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/book-computer" className="nav-link">Book Computer</Link>
              <Link to="/printer-services" className="nav-link">Printer Services</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
              {isAdmin && <Link to="/admin-dashboard" className="nav-link">Admin Dashboard</Link>}
              <button onClick={handleLogout} className="logout-button">
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header; 