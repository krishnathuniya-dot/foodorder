import React, { useState } from "react";

export default function Changepassword() {
  const userId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClear = () => {
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!userId) {
    alert("User not logged in");
    return;
  }

  if (formData.newPassword !== formData.confirmPassword) {
    alert("New Password and Confirm Password do not match");
    return;
  }

  try {
    const response = await fetch("http://localhost:2340/api/changepassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      }),
    });

    // ✅ safer handling
    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      console.error("Not JSON:", text);
      throw new Error("Invalid server response");
    }

    if (response.ok) {
      alert(data.message || "Password updated");
      handleClear();
    } else {
      alert(data.message || "Something failed");
    }

  } catch (error) {
    console.error("Frontend Error:", error);
    alert("Something went wrong (frontend)");
  }
};

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2>Change Password</h2>

        <form onSubmit={handleSubmit} className="profile-form">

          <label>Old Password</label>
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            required
          />

          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit">Update Password</button>

        </form>
      </div>
    </div>
  );
}