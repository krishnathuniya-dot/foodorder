import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {  useNavigate } from "react-router-dom";
import "../css/view.css";

export default function View() {
  const { orderNumber } = useParams();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetch(`http://localhost:2340/api/orders/order/${orderNumber}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data.order);
        setStatus(data.order.status || "pending");
        setRemark(data.order.restaurantRemark || "");
      });
  }, [orderNumber]);

  const updateOrder = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:2340/api/update-order/${order._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status,
            restaurantRemark: remark,
          }),
        }
      );

      const data = await res.json();
      alert(data.message);

      if (data.order) {
        setOrder(data.order);
      }
       navigate("/dash"); 
    } catch (err) {
      console.error(err);
      alert("Error updating order");
    } finally {
      setLoading(false);
    }
  };

  if (!order) return <p className="loading">Loading...</p>;

  return (
    <div className="main-container">

      {/* LEFT SIDE */}
      <div className="left-box">
        <h2>User Details</h2>

        <table>
          <tbody>
            <tr><td>Order Number</td><td>{order.orderNumber}</td></tr>
            <tr><td>First Name</td><td>{order.userId?.firstName}</td></tr>
            <tr><td>Last Name</td><td>{order.userId?.LastName}</td></tr>
            <tr><td>Email</td><td>{order.userId?.email}</td></tr>
            <tr><td>Mobile</td><td>{order.userId?.contact}</td></tr>
            <tr><td>Flat</td><td>{order.address?.flat}</td></tr>
            <tr><td>Street</td><td>{order.address?.street}</td></tr>
            <tr><td>Area</td><td>{order.address?.area}</td></tr>
            <tr><td>Landmark</td><td>{order.address?.landmark}</td></tr>
            <tr><td>City</td><td>{order.address?.city}</td></tr>
            <tr>
              <td>Order Date</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td className={`status ${order.status}`}>
                {order.status}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-box">
        <h2>Order Details</h2>

        <table className="order-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Food</th>
              <th>Name</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>

          <tbody>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>

                <td>
                  <img
                    src={`http://localhost:2340/uploads/${item.foodId?.image1}`}
                    alt=""
                  />
                </td>

                <td>{item.itemname}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price}</td>
              </tr>
            ))}

            <tr className="total-row">
              <td colSpan="4">Grand Total</td>
              <td>₹{order.totalAmount}</td>
            </tr>
          </tbody>
        </table>

        {/* 🔥 UPDATE SECTION */}
        <div className="up-container">
          <h3>Update Order</h3>

          <div className="up-field">
            <label>Restaurant Remark :</label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>

          <div className="up-field">
            <label>Restaurant Status :</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="preparing">Preparing</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          <button onClick={updateOrder} disabled={loading}>
            {loading ? "Updating..." : "Update Order"}
          </button>
        </div>

      </div>
    </div>
  );
}