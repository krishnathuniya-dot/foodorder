import React, { useEffect, useState } from "react";
import "../css/profile.css";

export default function Profile() {
  const userId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    firstName: "",
    LastName: "",
    email: "",
    contact: "",
    regDate: "",
  });

  useEffect(() => {
    if (!userId) return;

    fetch(`https://foodorder-lafi.onrender.com/api/profile/${userId}`)
      .then(res => res.json())
      .then(data => {
        console.log("API DATA ", data);

        const user = data.user;   // ✅ FIX

        setFormData({
          firstName: user.firstName || "",
          LastName: user.LastName || "",
          email: user.email || "",
          contact: user.contact || "",
          regDate: user.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : "",
        });
      })
      .catch(err => console.log(err));
  }, [userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`http://localhost:2340/api/profile/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    alert("Profile Updated ✅");
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2>My Profile</h2>

        <form className="profile-form" onSubmit={handleSubmit}>

          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />

          <label>Last Name</label>
          <input
            type="text"
            name="LastName"
            value={formData.LastName}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <div className="row">
            <div className="col">
              <label>Mobile Number</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
              />
            </div>

            <div className="col">
              <label>Registration Date</label>
              <input
                type="text"
                value={formData.regDate}
                readOnly
              />
            </div>
          </div>

          <button type="submit" className="update-btn">
            Update Profile
          </button>

        </form>
      </div>
    </div>
  );
}