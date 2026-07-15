import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/Detail.css";

export default function Detail() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetch(`https://foodorder-lafi.onrender.com/api/orders/order/${orderNumber}`)
      .then((res) => res.json())
      .then((data) => setOrder(data.order));
  }, [orderNumber]);

  if (!order) return <p>Loading...</p>;

  return (
    <div className="oi-container">

      {/* 🔹 TITLE */}
      <h2 className="oi-title">Order #{order.orderNumber} Details</h2>

      {/* 🔹 TOP TABLE (Details + Address) */}
      <table className="oi-order-table">
        <tbody>
          <tr>
            <td><b>Order Number#</b></td>
            <td>{order.orderNumber}</td>
            <td><b>Total Amount</b></td>
            <td>₹{order.totalAmount}</td>
          </tr>

          <tr>
            <td><b>Status</b></td>
            <td colSpan="3">
             {order.status}
            </td>
          </tr>
          <td><b>payment</b></td>
            <td colSpan="3">
             {order.paymentMethod}
            </td>
          

          <tr>
            <th colSpan="4" className="oi-section-header">
              Delivery Address
            </th>
          </tr>

          <tr>
            <td><b>House No</b></td>
            <td>{order.address?. flat}</td>
            <td><b>Street</b></td>
            <td>{order.address?.street}</td>
          </tr>

          <tr>
            <td><b>City</b></td>
            <td>{order.address?.city}</td>
            <td><b>Landmark</b></td>
            <td>{order.address?.landmark}</td>
          </tr>
        </tbody>
      </table>

    
      <div className="oi-action-links">
        <span>Invoice</span> | <span>Cancel this order</span>
      </div>

     
      <div className="oi-items-section">

       
        <div className="oi-table oi-header">
          <div>#</div>
          <div>Food Item</div>
          <div>Qty</div>
          <div>Per Unit Price</div>
          <div>Total</div>
        </div>

        
        {order.items.map((item, index) => (
          <div className="oi-table oi-row" key={index}>
            <div>
              <img
                src={`http://localhost:2340/uploads/${item.foodId?.image1}`}
                alt={item.itemname}
              />
            </div>

            <div>{item.itemname}</div>
            <div>{item.quantity}</div>
            <div>₹{item.price}</div>
            <div>₹{item.quantity * item.price}</div>
          </div>
        ))}

        {/* Grand Total */}
        <div className="oi-grand-total">
          <span>Grand Total</span>
          <span>₹{order.totalAmount}</span>
        </div>

      </div>

    </div>
  );
} 