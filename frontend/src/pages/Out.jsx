import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/managecategory.css";

export default function Out() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:2340/api/orderss/outfordeliverylist");

      const data = await res.json();

      if (data.success) {
        setOrders(data.data || []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.log("Error:", error);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="jj-manage-container">
      <h2>Out for Delivery Orders</h2>

      <table className="jj-mq-tables">
        <thead>
          <tr>
            <th>#</th>
            <th>Order Number</th>
            <th>Date</th>
            <th>Total ₹</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.length > 0 ? (
            orders.map((q, index) => (
              <tr key={q._id}>
                <td>{index + 1}</td>
                <td>{q.orderNumber}</td>
                <td>
                  {q.createdAt
                    ? new Date(q.createdAt).toLocaleString("en-IN")
                    : "N/A"}
                </td>
                <td>₹ {q.totalAmount}</td>

                <td>
                  <Link to={`/View/${q.orderNumber}`} className="jj-fri-edit-btn">
                    View
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No out-for-delivery orders found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}