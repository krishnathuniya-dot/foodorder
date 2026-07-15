import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/cart.css";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] =
    useState("online");

  const [address, setAddress] = useState({
    flat: "",
    street: "",
    area: "",
    landmark: "",
    city: "",
  });

  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  // =========================================
  // 🔥 LOAD RAZORPAY
  // =========================================

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement(
        "script"
      );

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  // =========================================
  // 🛒 FETCH CART
  // =========================================

  const fetchCart = async () => {
    try {
      const res = await fetch(
        `https://foodorder-lafi.onrender.com/api/getcart/${userId}`
      );

      const data = await res.json();

      setCart(data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  // =========================================
  // 💰 TOTAL
  // =========================================

  useEffect(() => {
    let sum = 0;

    cart.forEach((item) => {
      const price = Number(
        item.foodId?.price || 0
      );

      const qty = Number(
        item.quantity || 1
      );

      sum += price * qty;
    });

    setTotal(sum);
  }, [cart]);

  // =========================================
  // ❌ REMOVE ITEM
  // =========================================

  const removeItem = async (id) => {
    try {
      await fetch(
        `https://foodorder-lafi.onrender.com/api/removecart/${id}`,
        {
          method: "DELETE",
        }
      );

      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  // =========================================
  // 🏠 ADDRESS HANDLE
  // =========================================

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  // =========================================
  // 💳 HANDLE PAYMENT
  // =========================================

  const handlePayment = async () => {
    try {
      // 🔥 LOAD SDK

      const isLoaded = await loadRazorpay();

      if (!isLoaded) {
        alert("Razorpay SDK Failed");
        return;
      }

      // 🔥 CREATE ORDER

      const orderRes = await fetch(
        "https://foodorder-lafi.onrender.com/api/payment/order",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            amount: total + 40,
          }),
        }
      );

      const orderData = await orderRes.json();

      console.log(
        "ORDER DATA => ",
        orderData
      );

      if (!orderData.id) {
        alert("Order Creation Failed");
        return;
      }

      // =========================================
      // 💳 RAZORPAY OPTIONS
      // =========================================

      const options = {
        key: "rzp_test_Sk17vHFhO6fl8D",

        amount: orderData.amount,

        currency: "INR",

        name: "Food Delivery",

        description: "Food Order Payment",

        order_id: orderData.id,

        handler: async function (
          response
        ) {
          try {
            console.log(
              "RAZORPAY RESPONSE => ",
              response
            );

            // 🔥 VERIFY PAYMENT

            const verifyRes = await fetch(
              "https://foodorder-lafi.onrender.com/api/payment/verify",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify({
                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,
                }),
              }
            );

            const verifyData =
              await verifyRes.json();

            console.log(
              "VERIFY DATA => ",
              verifyData
            );

            // =========================================
            // ✅ PAYMENT VERIFIED
            // =========================================

            if (verifyData.success) {
              const payload = {
                userId,

                paymentId:
                  response.razorpay_payment_id,

                paymentMethod:
                  "online",

                cart: cart.map((item) => ({
                  foodId:
                    item.foodId?._id ||
                    item.foodId,

                  quantity: Number(
                    item.quantity || 1
                  ),
                })),

                address,
              };

              // 🔥 PLACE ORDER

              const placeOrderRes =
                await fetch(
                  "https://foodorder-lafi.onrender.com/api/order",
                  {
                    method: "POST",

                    headers: {
                      "Content-Type":
                        "application/json",
                    },

                    body: JSON.stringify(
                      payload
                    ),
                  }
                );

              const finalData =
                await placeOrderRes.json();

              console.log(
                "FINAL ORDER => ",
                finalData
              );

              if (finalData.success) {
                alert(
                  `✅ Order Placed Successfully\nOrder No: ${finalData.orderNumber}`
                );

                setCart([]);

                navigate("/");
              } else {
                alert(
                  "Order Place Failed"
                );
              }
            } else {
              alert(
                "❌ Payment Verification Failed"
              );
            }
          } catch (error) {
            console.log(error);

            alert(
              "Something Went Wrong"
            );
          }
        },

        prefill: {
          name: "Customer",

          email: "test@test.com",

          contact: "9999999999",
        },

        notes: {
          address: "Food Delivery",
        },

        theme: {
          color: "#ff6600",
        },
      };

      // =========================================
      // 🔥 OPEN PAYMENT WINDOW
      // =========================================

      const razor = new window.Razorpay(
        options
      );

      razor.on("payment.failed", function (
        response
      ) {
        console.log(
          "PAYMENT FAILED => ",
          response
        );

        alert("Payment Failed");
      });

      razor.open();
    } catch (error) {
      console.log(error);

      alert("Payment Error");
    }
  };

  // =========================================
  // 🧾 PLACE ORDER
  // =========================================

  const placeOrder = async () => {
    if (!userId) {
      alert("Please Login");
      return;
    }

    if (!cart.length) {
      alert("Cart Empty");
      return;
    }

    if (
      !address.flat ||
      !address.street ||
      !address.area ||
      !address.city
    ) {
      alert(
        "Please Fill Delivery Address"
      );

      return;
    }

    // =========================================
    // 💳 ONLINE PAYMENT
    // =========================================

    if (paymentMethod === "online") {
      handlePayment();
    }

    // =========================================
    // 💵 COD
    // =========================================

    else {
      try {
        const payload = {
          userId,

          paymentMethod: "cod",

          cart: cart.map((item) => ({
            foodId:
              item.foodId?._id ||
              item.foodId,

            quantity: Number(
              item.quantity || 1
            ),
          })),

          address,
        };

        const res = await fetch(
          "https://foodorder-lafi.onrender.com/api/order",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(payload),
          }
        );

        const data = await res.json();

        if (data.success) {
          alert(
            `✅ COD Order Placed\nOrder No: ${data.orderNumber}`
          );

          setCart([]);

          navigate("/");
        } else {
          alert("Order Failed");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="kur-cart-vertical">
      {/* ========================================= */}
      {/* 🛒 CART */}
      {/* ========================================= */}

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
          const price = Number(
            item.foodId?.price || 0
          );

          const qty = Number(
            item.quantity || 1
          );

          return (
            <div
              className="kur-cart-row"
              key={item._id}
            >
              <img
                src={`https://foodorder-lafi.onrender.com/uploads/${item.foodId?.image1}`}
                className="kur-cart-img"
                alt=""
              />

              <div>
                {item.foodId?.itemname}
              </div>

              <div>{qty}</div>

              <div>₹{price}</div>

              <div>₹{price * qty}</div>

              <div
                className="kur-cart-delete"
                onClick={() =>
                  removeItem(item._id)
                }
              >
                🗑️
              </div>
            </div>
          );
        })}

        {cart.length > 0 && (
          <div className="kur-cart-total-row">
            <div></div>
            <div></div>
            <div></div>

            <div className="kur-total-label">
              Grand Total
            </div>

            <div className="kur-total-value">
              ₹{total}
            </div>

            <div></div>
          </div>
        )}
      </div>

      {/* ========================================= */}
      {/* 📍 ADDRESS */}
      {/* ========================================= */}

      <div className="kur-bottom-box">
        <h3>📍 Delivery Address</h3>

        <div className="kur-address-form">
          <input
            name="flat"
            placeholder="Flat / House No"
            onChange={handleChange}
          />

          <input
            name="street"
            placeholder="Street"
            onChange={handleChange}
          />

          <input
            name="area"
            placeholder="Area"
            onChange={handleChange}
          />

          <input
            name="landmark"
            placeholder="Landmark"
            onChange={handleChange}
          />

          <input
            name="city"
            placeholder="City"
            onChange={handleChange}
          />
        </div>

        {/* ========================================= */}
        {/* 💳 PAYMENT */}
        {/* ========================================= */}

        <h3>💳 Payment Method</h3>

        <div className="kur-payment">
          <label>
            <input
              type="radio"
              value="online"
              checked={
                paymentMethod ===
                "online"
              }
              onChange={(e) =>
                setPaymentMethod(
                  e.target.value
                )
              }
            />

            Online 💳
          </label>

          <label>
            <input
              type="radio"
              value="cod"
              checked={
                paymentMethod === "cod"
              }
              onChange={(e) =>
                setPaymentMethod(
                  e.target.value
                )
              }
            />

            COD 💵
          </label>
        </div>

        {/* ========================================= */}
        {/* 💰 SUMMARY */}
        {/* ========================================= */}

        <div className="kur-summary">
          <div>
            Items Total: ₹{total}
          </div>

          <div>Delivery: ₹40</div>

          <div className="kur-summary-final">
            Total: ₹{total + 40}
          </div>
        </div>

        {/* ========================================= */}
        {/* 🚀 BUTTON */}
        {/* ========================================= */}

        <button
          className="kur-place-btn"
          onClick={placeOrder}
        >
          Place Order 🚀
        </button>
      </div>
    </div>
  );
}