import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaBox, FaKey, FaSignOutAlt } from "react-icons/fa";
import "../css/sidenavbar.css";

export default function Sidenavbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    console.log("Logout Clicked");

    // clear storage
    localStorage.removeItem("user");
    localStorage.removeItem("userId");

    alert("Signed out successfully");

    // redirect to login/home
    navigate("/", { replace: true });
  };

  return (
    <div className="sidebar">

      {/* USER CARD */}
      <div className="user-card">
        <div className="avatar"></div>

        <h3>{user?.firstName || "User Name"}</h3>
        <p>{user?.email || "email@gmail.com"}</p>

        <button
          type="button"
          className="signout-btn"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="icon" />
          Sign Out
        </button>
      </div>

      {/* MENU */}
      <div className="menu">
        <Link to="/account" className="menu-item">
          <FaBox className="icon" />
          My Orders
        </Link>

        <Link to="/changepassword" className="menu-item">
          <FaKey className="icon" />
          Change Password
        </Link>

        <Link to="/profile" className="menu-item">
          <FaUser className="icon" />
          Profile
        </Link>
      </div>

    </div>
  );
}