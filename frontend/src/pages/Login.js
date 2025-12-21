import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Special case for admin
      if (username === "admin" && password === "admin") {
        localStorage.setItem("token", "admin-token");
        localStorage.setItem("userDetails", JSON.stringify({
          username: "Admin",
          email: "admin@cybercafe.com",
          role: "admin"
        }));
        navigate("/admin-dashboard");
        return;
      }

      // Login request using axios
      const loginResponse = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password
      });

      if (loginResponse.data) {
        // Get stored user details from registration
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const currentUser = registeredUsers.find(user => user.username === username);

        if (currentUser) {
          // Store complete user details
          const userDetails = {
            username: currentUser.username,
            email: currentUser.email,
            phoneNumber: currentUser.phoneNumber,
            dateOfBirth: currentUser.dateOfBirth,
            address: currentUser.address,
            role: 'user'
          };
          localStorage.setItem('token', loginResponse.data.token);
          localStorage.setItem('userDetails', JSON.stringify(userDetails));
        } else {
          // Fallback if user details not found
          localStorage.setItem('token', loginResponse.data.token);
          localStorage.setItem('userDetails', JSON.stringify({
            username: username,
            role: 'user'
          }));
        }
        
        navigate('/user-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        setError(error.response.data.message || 'Invalid credentials');
      } else if (error.request) {
        setError('Server is not responding. Please try again later.');
      } else {
        setError('An error occurred during login');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      
      // Create user object from Google data
      const googleUser = {
        username: decoded.name,
        email: decoded.email,
        // You can add more fields as needed
        googleId: decoded.sub,
        role: 'user',
        registrationDate: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };

      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Check if user already exists
      const existingUser = existingUsers.find(user => user.email === decoded.email);
      
      if (existingUser) {
        // Update existing user's last activity
        existingUser.lastActivity = new Date().toISOString();
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
        localStorage.setItem('userDetails', JSON.stringify(existingUser));
      } else {
        // Add new user
        existingUsers.push(googleUser);
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
        localStorage.setItem('userDetails', JSON.stringify(googleUser));
      }

      // Redirect based on role
      navigate(googleUser.role === 'admin' ? '/admin-dashboard' : '/user-dashboard');
    } catch (error) {
      setError('Failed to login with Google. Please try again.');
    }
  };

  const handleGoogleError = () => {
    setError('Failed to login with Google. Please try again.');
  };

  return (
    <div className="layout-container">
      <Header />
      <div className="login-container">
        <div className="auth-card">
          <h2>Welcome Back</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <div className="input-group">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <i className="fas fa-user" style={{ right: '15px', left: 'auto' }}></i>
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} onClick={togglePasswordVisibility} style={{ right: '15px', left: 'auto', cursor: 'pointer' }}></i>
              </div>
            </div>
            <button type="submit">Sign In</button>
          </form>
          
          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="social-login">
            <GoogleOAuthProvider clientId="189416931130-v6lfeh3n2tm5595s827cn69pn0q532si.apps.googleusercontent.com">
              <div className="google-btn">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme="filled_blue"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  logo_alignment="center"
                />
              </div>
            </GoogleOAuthProvider>
          </div>

          <p className="auth-link">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
