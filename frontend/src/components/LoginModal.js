import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuthModal } from "../context/AuthModalContext";

const LoginModal = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { closeModal, openRegister } = useAuthModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (username === "admin" && password === "admin") {
        localStorage.setItem("token", "admin-token");
        localStorage.setItem("userDetails", JSON.stringify({
          username: "Admin",
          email: "admin@cybercafe.com",
          role: "admin"
        }));
        closeModal();
        navigate("/admin-dashboard");
        return;
      }

      const loginResponse = await axios.post("/api/auth/login", { username, password });

      if (loginResponse.data) {
        const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
        const currentUser = registeredUsers.find((user) => user.username === username);

        if (currentUser) {
          localStorage.setItem("token", loginResponse.data.token);
          localStorage.setItem("userDetails", JSON.stringify({
            username: currentUser.username,
            email: currentUser.email,
            phoneNumber: currentUser.phoneNumber,
            dateOfBirth: currentUser.dateOfBirth,
            address: currentUser.address,
            role: "user"
          }));
        } else {
          localStorage.setItem("token", loginResponse.data.token);
          localStorage.setItem("userDetails", JSON.stringify({ username, role: "user" }));
        }

        closeModal();
        navigate("/user-dashboard");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Invalid credentials");
      } else if (err.request) {
        setError("Server is not responding. Please try again later.");
      } else {
        setError("An error occurred during login");
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const googleUser = {
        username: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
        role: "user",
        registrationDate: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };

      const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const existingUser = existingUsers.find((user) => user.email === decoded.email);

      if (existingUser) {
        existingUser.lastActivity = new Date().toISOString();
        localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));
        localStorage.setItem("userDetails", JSON.stringify(existingUser));
      } else {
        existingUsers.push(googleUser);
        localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));
        localStorage.setItem("userDetails", JSON.stringify(googleUser));
      }

      closeModal();
      navigate(googleUser.role === "admin" ? "/admin-dashboard" : "/user-dashboard");
    } catch {
      setError("Failed to login with Google. Please try again.");
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={closeModal}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="auth-modal-close" onClick={closeModal} aria-label="Close">
          <i className="fas fa-times"></i>
        </button>

        <div className="auth-card auth-card-modal">
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
                  placeholder="Enter your username"
                  required
                />
                <i className="fas fa-user input-icon-right"></i>
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} input-icon-right clickable`}
                  onClick={() => setShowPassword(!showPassword)}
                  role="button"
                  tabIndex={0}
                  aria-label="Toggle password visibility"
                ></i>
              </div>
            </div>

            <button type="submit">Sign In</button>
          </form>

          <div className="auth-divider"><span>or</span></div>

          <div className="social-login">
            <GoogleOAuthProvider clientId="189416931130-v6lfeh3n2tm5595s827cn69pn0q532si.apps.googleusercontent.com">
              <div className="google-btn">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Failed to login with Google. Please try again.")}
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
            Don&apos;t have an account?{" "}
            <button type="button" className="auth-link-button" onClick={openRegister}>
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
