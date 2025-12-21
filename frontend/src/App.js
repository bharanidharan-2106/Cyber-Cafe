import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Profile from "./pages/Profile";
import PrinterServices from "./pages/PrinterServices";
import Navbar from "./components/Navbar";
import BookComputer from "./pages/BookComputer";
import Home from "./pages/Home";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/book-computer" element={<BookComputer />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/printer-services" element={<PrinterServices />} />
      </Routes>
    </div>
  );
}

export default App;
