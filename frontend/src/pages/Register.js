import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    dateOfBirth: "",
    address: ""
  });
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push("Password must contain at least one special character (!@#$%^&*)");
    }
    return errors;
  };

  const validateDateOfBirth = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 8) {
      return "You must be at least 8 years old to register";
    }
    if (birthDate > today) {
      return "Date of birth cannot be in the future";
    }
    return "";
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Username validation
    if (!formData.username.trim()) {
      errors.username = "Username is required";
      isValid = false;
    }

    // Password validation
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      errors.password = passwordErrors;
      isValid = false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // Phone number validation
    if (!formData.phoneNumber.match(/^\d{10}$/)) {
      errors.phoneNumber = "Phone number must be exactly 10 digits";
      isValid = false;
    }

    // Date of birth validation
    const dobError = validateDateOfBirth(formData.dateOfBirth);
    if (dobError) {
      errors.dateOfBirth = dobError;
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Address validation
    if (!formData.address.trim()) {
      errors.address = "Address is required";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear specific error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      return;
    }

    try {
      // Registration request using axios
      const registerResponse = await axios.post("http://localhost:5000/api/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address
      });

      if (registerResponse.data) {
        // Create new user object
        const newUser = {
          username: formData.username,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          dateOfBirth: formData.dateOfBirth,
          address: formData.address,
          role: 'user',
          registrationDate: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        };

        // Add to registered users in localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        registeredUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

        // Store user details and token
        localStorage.setItem('token', registerResponse.data.token);
        localStorage.setItem('userDetails', JSON.stringify(newUser));

        navigate('/user-dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        setError(error.response.data.message || 'Registration failed');
      } else if (error.request) {
        setError('Server is not responding. Please try again later.');
      } else {
        setError('An error occurred during registration');
      }
    }
  };

  return (
    <div className="register-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <div className="input-group">
              <i className="fas fa-user"></i>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            {validationErrors.username && (
              <div className="validation-message">{validationErrors.username}</div>
            )}
          </div>
          <div className="form-group">
            <label>Email</label>
            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            {validationErrors.email && (
              <div className="validation-message">{validationErrors.email}</div>
            )}
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            {validationErrors.password && (
              <div className="validation-message">
                {Array.isArray(validationErrors.password) 
                  ? validationErrors.password.map((err, index) => (
                      <div key={index}>{err}</div>
                    ))
                  : validationErrors.password}
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            {validationErrors.confirmPassword && (
              <div className="validation-message">{validationErrors.confirmPassword}</div>
            )}
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <div className="input-group">
              <i className="fas fa-phone"></i>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                pattern="[0-9]{10}"
                required
              />
            </div>
            {validationErrors.phoneNumber && (
              <div className="validation-message">{validationErrors.phoneNumber}</div>
            )}
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <div className="input-group">
              <i className="fas fa-calendar"></i>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            {validationErrors.dateOfBirth && (
              <div className="validation-message">{validationErrors.dateOfBirth}</div>
            )}
          </div>
          <div className="form-group">
            <label>Address</label>
            <div className="input-group">
              <i className="fas fa-map-marker-alt"></i>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            {validationErrors.address && (
              <div className="validation-message">{validationErrors.address}</div>
            )}
          </div>
          <button type="submit">Create Account</button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="social-login">
          <button className="social-button">
            <i className="fab fa-google"></i>
          </button>
          <button className="social-button">
            <i className="fab fa-facebook-f"></i>
          </button>
          <button className="social-button">
            <i className="fab fa-twitter"></i>
          </button>
        </div>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register; 