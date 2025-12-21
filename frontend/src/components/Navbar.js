import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isAdminDashboard = location.pathname === "/admin-dashboard";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userDetails");
    navigate("/");
  };

  // Don't show navbar on login or register pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <i className="fas fa-laptop-code"></i>
          <span>Cyber Cafe</span>
        </Link>

        <button 
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>

        <ul className={isMobileMenuOpen ? 'show' : ''}>
          {location.pathname === '/' ? (
            <>
              <li>
                <Link to="/login" className="nav-link">
                  <i className="fas fa-sign-in-alt"></i>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="nav-link">
                  <i className="fas fa-user-plus"></i>
                  Register
                </Link>
              </li>
            </>
          ) : isAdminDashboard ? (
            <>
              <li><span className="nav-title">Admin Dashboard</span></li>
              <li>
                <button onClick={handleLogout} className="nav-link">
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </li>
            </>
          ) : token ? (
            <>
              <li>
                <Link to="/user-dashboard" className={location.pathname === '/user-dashboard' ? 'active' : ''}>
                  <i className="fas fa-home"></i>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/book-computer" className={location.pathname === '/book-computer' ? 'active' : ''}>
                  <i className="fas fa-desktop"></i>
                  Book Computer
                </Link>
              </li>
              <li>
                <Link to="/printer-services" className={location.pathname === '/printer-services' ? 'active' : ''}>
                  <i className="fas fa-print"></i>
                  Printer Services
                </Link>
              </li>
              <li>
                <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
                  <i className="fas fa-user"></i>
                  Profile
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="nav-link">
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </li>
            </>
          ) : null}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;