import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/cart.css";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("online");

  const [address, setAddress] = useState({
    flat: "",
    street: "",
    area: "",
    landmark: "",
    city: "",
  });

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // 🔥 Razorpay Loader
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 🛒 Fetch Cart
  const fetchCart = async () => {
    const res = await fetch(`http://localhost:2340/api/getcart/${userId}`);
    const data = await res.json();
    setCart(data.data || []);
  };

  useEffect(() => {
    if (userId) fetchCart();
  }, [userId]);

  // 💰 Total
  useEffect(() => {
    let sum = 0;
    cart.forEach((item) => {
      const price = Number(item.foodId?.price || 0);
      const qty = Number(item.quantity || 1);
      sum += price * qty;
    });
    setTotal(sum);
  }, [cart]);

  // ❌ Remove
  const removeItem = async (id) => {
    await fetch(`http://localhost:2340/api/removecart/${id}`, {
      method: "DELETE",
    });
    fetchCart();
  };

  // 🏠 Address
  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // 💳 Payment
  const handlePayment = async () => {
    const isLoaded = await loadRazorpay();
    if (!isLoaded) return alert("Razorpay failed");

    const res = await fetch("http://localhost:2340/api/payment/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: total }),
    });

    const data = await res.json();
    if (!data.id) return alert("Order creation failed");

    const options = {
      key: "rzp_test_Sk17vHFhO6fl8D",
      amount: data.amount,
      currency: "INR",
      order_id: data.id,

      handler: async function (response) {
        const verifyRes = await fetch(
          "http://localhost:2340/api/payment/verify",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: data.id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          }
        );

        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          await placeOrderAfterPayment(response);
        } else {
          alert("Payment verification failed");
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // ✅ After Payment
  const placeOrderAfterPayment = async (paymentData) => {
    const payload = {
      userId,
      paymentId: paymentData.razorpay_payment_id,
      paymentMethod: "online",
      cart: cart.map((item) => ({
        foodId: item.foodId?._id || item.foodId,
        quantity: Number(item.quantity || 1),
      })),
      address,
    };

    const res = await fetch("http://localhost:2340/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      alert(`✅ Order placed!\nOrder No: ${data.orderNumber}`);
      setCart([]);
      navigate("/");
    }
  };

  // 🧾 Place Order
  const placeOrder = async () => {
    if (!userId) return alert("Login required");
    if (!address.city || !address.flat) return alert("Fill address");
    if (!cart.length) return alert("Cart empty");

    if (paymentMethod === "online") {
      handlePayment();
    } else {
      const payload = {
        userId,
        paymentMethod: "cod",
        cart: cart.map((item) => ({
          foodId: item.foodId?._id || item.foodId,
          quantity: Number(item.quantity || 1),
        })),
        address,
      };

      const res = await fetch("http://localhost:2340/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        alert(`✅ Order placed (COD)\nOrder No: ${data.orderNumber}`);
        setCart([]);
        navigate("/");
      }
    }
  };

  return (
    <div className="kur-cart-vertical">

      {/* 🛒 CART */}
      <div className="kur-cart-box">

        <div className="kur-cart-top">
          <h2>🛒 Your Cart</h2>
          <div className="kur-cart-total-badge">
            {cart.length} items • ₹{total}
          </div>
        </div>

        <div className="kur-cart-header">
          <div>Image</div>
          <div>Name</div>
          <div>Qty</div>
          <div>Price</div>
          <div>Total</div>
          <div></div>
        </div>

        {cart.map((item) => {
          const price = Number(item.foodId?.price || 0);
          const qty = Number(item.quantity || 1);

          return (
            <div className="kur-cart-row" key={item._id}>
              <img
                src={`http://localhost:2340/uploads/${item.foodId?.image1}`}
                className="kur-cart-img"
                alt=""
              />
              <div>{item.foodId?.itemname}</div>
              <div>{qty}</div>
              <div>₹{price}</div>
              <div>₹{price * qty}</div>

              <div
                className="kur-cart-delete"
                onClick={() => removeItem(item._id)}
              >
                🗑️
              </div>
            </div>
          );
        })}

        {/* ✅ TOTAL ROW (FIXED) */}
        {cart.length > 0 && (
          <div className="kur-cart-total-row">
            <div></div>
            <div></div>
            <div></div>
            <div className="kur-total-label">Grand Total</div>
            <div className="kur-total-value">₹{total}</div>
            <div></div>
          </div>
        )}

      </div>

      {/* 📍 ADDRESS */}
      <div className="kur-bottom-box">

        <h3>📍 Delivery Address</h3>

        <div className="kur-address-form">
          <input name="flat" placeholder="Flat" onChange={handleChange} />
          <input name="street" placeholder="Street" onChange={handleChange} />
          <input name="area" placeholder="Area" onChange={handleChange} />
          <input name="landmark" placeholder="Landmark" onChange={handleChange} />
          <input name="city" placeholder="City" onChange={handleChange} />
        </div>

        <h3>💳 Payment Method</h3>

        <div className="kur-payment">
          <label>
            <input type="radio" value="online"
              checked={paymentMethod === "online"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Online 💳
          </label>

          <label>
            <input type="radio" value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            COD 💵
          </label>
        </div>

        <div className="kur-summary">
          <div>Items Total: ₹{total}</div>
          <div>Delivery: ₹40</div>
          <div className="kur-summary-final">
            Total: ₹{total + 40}
          </div>
        </div>

        <button className="kur-place-btn" onClick={placeOrder}>
          Place Order 🚀
        </button>

      </div>
    </div>
  );
}