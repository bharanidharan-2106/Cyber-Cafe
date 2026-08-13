import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthModal } from "../context/AuthModalContext";

const RegisterModal = () => {
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { closeModal, openLogin } = useAuthModal();

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("Password must be at least 8 characters long");
    if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("Password must contain at least one lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("Password must contain at least one number");
    if (!/[!@#$%^&*]/.test(password)) errors.push("Password must contain at least one special character (!@#$%^&*)");
    return errors;
  };

  const validateDateOfBirth = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    if (age < 8) return "You must be at least 8 years old to register";
    if (birthDate > today) return "Date of birth cannot be in the future";
    return "";
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");

    if (!formData.username.trim()) {
      errors.username = "Username is required";
      isValid = false;
    } else if (registeredUsers.some(
      (u) => u.username.toLowerCase() === formData.username.trim().toLowerCase()
    )) {
      errors.username = "Username is already taken";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    } else if (registeredUsers.some(
      (u) => u.email.toLowerCase() === formData.email.trim().toLowerCase()
    )) {
      errors.email = "Email is already registered";
      isValid = false;
    }

    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      errors.password = passwordErrors;
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!formData.phoneNumber.match(/^\d{10}$/)) {
      errors.phoneNumber = "Phone number must be exactly 10 digits";
      isValid = false;
    }

    const dobError = validateDateOfBirth(formData.dateOfBirth);
    if (dobError) {
      errors.dateOfBirth = dobError;
      isValid = false;
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      const registerResponse = await axios.post("/api/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address
      });

      if (registerResponse.data) {
        const newUser = {
          username: formData.username,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          dateOfBirth: formData.dateOfBirth,
          address: formData.address,
          role: "user",
          registrationDate: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        };

        const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
        registeredUsers.push(newUser);
        localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
        localStorage.setItem("token", registerResponse.data.token || "");
        localStorage.setItem("userDetails", JSON.stringify(newUser));

        closeModal();
        navigate("/user-dashboard");
      }
    } catch (err) {
      if (err.response) {
        const message = err.response.data.message || "Registration failed";
        if (message.toLowerCase().includes("duplicate") || message.toLowerCase().includes("unique")) {
          setError("Username or email is already registered");
        } else {
          setError(message);
        }
      } else if (err.request) {
        setError("Server is not responding. Please try again later.");
      } else {
        setError("An error occurred during registration");
      }
    }
  };

  const renderField = (label, name, type, icon, extra = {}) => {
    const { placeholder, pattern, max } = extra;
    return (
      <div className="form-group">
        <label>{label}</label>
        <div className="input-group">
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            required
            placeholder={placeholder}
            pattern={pattern}
            max={max}
          />
          <i className={`fas ${icon} input-icon-right`}></i>
        </div>
        {validationErrors[name] && (
          <div className="validation-message">
            {Array.isArray(validationErrors[name])
              ? validationErrors[name].map((msg, i) => <div key={i}>{msg}</div>)
              : validationErrors[name]}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="auth-modal-overlay" onClick={closeModal}>
      <div className="auth-modal auth-modal-wide" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="auth-modal-close" onClick={closeModal} aria-label="Close">
          <i className="fas fa-times"></i>
        </button>

        <div className="auth-card auth-card-modal">
          <h2>Create Account</h2>
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            {renderField("Username", "username", "text", "fa-user", { placeholder: "Choose a username" })}
            {renderField("Email", "email", "email", "fa-envelope", { placeholder: "Enter your email" })}

            <div className="form-group">
              <label>Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                />
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} input-icon-right clickable`}
                  onClick={() => setShowPassword(!showPassword)}
                  role="button"
                  tabIndex={0}
                ></i>
              </div>
              {validationErrors.password && (
                <div className="validation-message">
                  {Array.isArray(validationErrors.password)
                    ? validationErrors.password.map((msg, i) => <div key={i}>{msg}</div>)
                    : validationErrors.password}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  required
                />
                <i
                  className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} input-icon-right clickable`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  role="button"
                  tabIndex={0}
                ></i>
              </div>
              {validationErrors.confirmPassword && (
                <div className="validation-message">{validationErrors.confirmPassword}</div>
              )}
            </div>

            {renderField("Phone Number", "phoneNumber", "tel", "fa-phone", {
              pattern: "[0-9]{10}",
              placeholder: "10-digit mobile number"
            })}
            {renderField("Date of Birth", "dateOfBirth", "date", "fa-calendar", {
              max: new Date().toISOString().split("T")[0]
            })}
            {renderField("Address", "address", "text", "fa-map-marker-alt", { placeholder: "Your address" })}

            <button type="submit">Create Account</button>
          </form>

          <p className="auth-link">
            Already have an account?{" "}
            <button type="button" className="auth-link-button" onClick={openLogin}>
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
