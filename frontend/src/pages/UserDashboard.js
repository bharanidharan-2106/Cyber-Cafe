import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const UserDashboard = () => {
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");

  useEffect(() => {
    // Check if user is logged in and is not admin
    const userDetails = localStorage.getItem('userDetails');
    if (!userDetails) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userDetails);
    if (user.role === 'admin') {
      navigate('/admin-dashboard');
      return;
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="layout-container">
      <main className="main-content">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h2>Welcome, {userDetails.username}!</h2>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-desktop"></i>
              </div>
              <h3>Book Computer</h3>
              <p>Reserve a high-performance computer for your needs</p>
              <Link to="/book-computer" className="service-button">Book Now</Link>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-print"></i>
              </div>
              <h3>Printer Services</h3>
              <p>Print, scan, and copy documents with ease</p>
              <Link to="/printer-services" className="service-button">Use Printer</Link>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-user"></i>
              </div>
              <h3>My Profile</h3>
              <p>View and manage your account settings</p>
              <Link to="/profile" className="service-button">View Profile</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserDashboard;