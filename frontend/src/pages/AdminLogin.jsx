import React, { useState } from "react";
import "../css/admin.css";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fixedEmail = "admin@gmail.com";
    const fixedPassword = "krishnaadmin";

    if (
      formData.email === fixedEmail &&
      formData.password === fixedPassword
    ) {
      const admin = {
        email: fixedEmail,
        role: "admin",
      };

      // ✅ FIXED
      localStorage.setItem("admin", JSON.stringify(admin));

      console.log("Login Success ✅");

      navigate("/dash");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="title">Admin Login</h1>

        <input
          type="email"
          name="email"
          className="input-field"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          className="input-field"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="login-btn">
          Admin Login
        </button>
      </form>
    </div>
  );
}   