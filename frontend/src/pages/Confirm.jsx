import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "../css/managecategory.css";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await fetch("https://foodorder-lafi.onrender.com/api/orderss/accepted-list");
      const data = await res.json();

      setOrders(data?.data || []);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔍 Search Logic
  const filteredOrders = orders.filter((o) => {
    const search = searchTerm.toLowerCase().trim();

    return (
      o.orderNumber?.toLowerCase().includes(search) ||
      o.totalAmount?.toString().includes(search) ||
      o.userId?.firstName?.toLowerCase().includes(search) ||
      (o.createdAt &&
        new Date(o.createdAt)
          .toLocaleString()
          .toLowerCase()
          .includes(search))
    );
  });

  return (
    <div className="order-container">
      <h2 className="order-title">✅ Confirmed Orders</h2>

      {/* 🔍 Search + Count */}
      <div className="order-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by user, order no, date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="order-count">
          Total Orders: <span>{filteredOrders.length}</span>
        </div>
      </div>

      {/* 📋 Table */}
      <div className="order-table-wrapper">
        <table className="order-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Order No</th>
              <th>Date</th>
              <th>Total ₹</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((q, index) => (
                <tr key={q._id}>
                  <td>{index + 1}</td>

                  <td>{q.userId?.firstName || "User"}</td>

                  <td className="order-id">{q.orderNumber}</td>

                  <td>
                    {q.createdAt
                      ? new Date(q.createdAt).toLocaleDateString("en-IN")
                      : "N/A"}
                  </td>

                  <td className="amount">₹ {q.totalAmount}</td>

                  <td>
                    <Link
                      to={`/View/${q.orderNumber}`}
                      className="view-btn"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No orders found 😢
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}