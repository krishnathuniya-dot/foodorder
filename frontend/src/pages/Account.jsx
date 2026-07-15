import React, { useEffect, useState } from "react";
import "../css/account.css";
import { Link } from "react-router-dom";
export default function Account() {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetchOrders();
    } else {
      console.log("User not logged in");
    }
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`https://foodorder-lafi.onrender.com/api/orders/${userId}`);

      // 👇 Handle non-JSON response (IMPORTANT)
      if (!res.ok) {
        const text = await res.text();
        console.log("Server Error Response:", text);
        return;
      }

      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
      } else {
        console.log("API Error:", data.message);
      }
    } catch (err) {
      console.log("Fetch Error:", err);
    }
  };

  return (
    <div className="profile-page">
      <div className="right">
        <h2 className="page-title">MY ORDERS</h2>

        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order._id}>
              
              <div className="order-img">ORDER</div>

              <div className="order-details">
                <p className="order-date">
                  Order Date :{" "}
                 {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}
                </p>

                <h3>Order # {order.orderNumber}</h3>

                <div className="order-actions">
                  <span className="status">
                    {order.status || "Pending"}
                  </span>

                  <button className="details-btn">
                   <Link to={`/detail/${order.orderNumber}`}>Order Details</Link> 
                  </button>
                </div>

                <p className="track">🚚 Track Order</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}