import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/admindash.css";

import {
  FaTachometerAlt,
  FaCar,
  FaClipboardList,
  FaCommentDots,
  FaTags,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

export default function Dashboardd() {
  const [openOrders, setOpenOrders] = useState(false);
  const [openFood, setOpenFood] = useState(false);
  const [openCategory, setOpenCategory] = useState(false); // 🔥 NEW

  return (
    <div className="sidebarr">

      {/* BRAND */}
      <div className="sidebar-header">
        <h2 className="brand-name">Krishna Thuniya</h2>
        <p className="brand-sub">Admin Panel</p>
      </div>

      <h4 className="logoo">MAIN</h4>

      <ul>
        <li>
          <Link to="/dash">
            <FaTachometerAlt /> Dashboards
          </Link>
        </li>

        <li>
          <Link to="/users">
            <FaTags /> Reg Users
          </Link>
        </li>

        {/* 🍱 CATEGORY DROPDOWN (NEW) */}
        <li className="dropdown">
          <div
            className="dropdown-title"
            onClick={() => setOpenCategory(!openCategory)}
          >
            <FaTags /> Category
            {openCategory ? <FaChevronUp /> : <FaChevronDown />}
          </div>

          {openCategory && (
            <ul className="dropdown-menu">
              <li><Link to="/category">Add Category</Link></li>
              <li><Link to="/managecategory">Manage Category</Link></li>
            </ul>
          )}
        </li>

        {/* 🍔 FOOD DROPDOWN */}
        <li className="dropdown">
          <div
            className="dropdown-title"
            onClick={() => setOpenFood(!openFood)}
          >
            <FaCar /> Food
            {openFood ? <FaChevronUp /> : <FaChevronDown />}
          </div>

          {openFood && (
            <ul className="dropdown-menu">
              <li><Link to="/addfood">Add Food</Link></li>
              <li><Link to="/managefood">Manage Food</Link></li>
            </ul>
          )}
        </li>

        {/* 📦 ORDERS DROPDOWN */}
        <li className="dropdown">
          <div
            className="dropdown-title"
            onClick={() => setOpenOrders(!openOrders)}
          >
            <FaCar /> Orders
            {openOrders ? <FaChevronUp /> : <FaChevronDown />}
          </div>

          {openOrders && (
            <ul className="dropdown-menu">
              <li><Link to="/orderdata">All Orders</Link></li>
              <li><Link to="/new">New Orders</Link></li>
              <li><Link to="/confirm">Accepted Orders</Link></li>
              <li><Link to="/prepare">Preparing Orders</Link></li>
              <li><Link to="/out">Out for Delivery</Link></li>
              <li><Link to="/deliver">Delivered Orders</Link></li>
              <li><Link to="/cancel">Cancelled Orders</Link></li>
            </ul>
          )}
        </li>

        <li>
          <Link to="/managebooking">
            <FaClipboardList /> Reports
          </Link>
        </li>

        <li>
          <Link to="/testimonaldata">
            <FaCommentDots /> Search
          </Link>
        </li>
      </ul>
    </div>
  );
}