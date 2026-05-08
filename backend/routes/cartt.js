const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const Cart = require("../model/cart");
const Food = require("../model/food");
const Order = require("../model/address");

// ⚠️ IMPORTANT: NEW SECRET KEY use karo
const razorpay = new Razorpay({
  key_id: "rzp_test_Sk17vHFhO6fl8D",
  key_secret: "yyYiZ1j4KcnwxOt7Wk2XgCMQ",
});




// ============================
// 🛒 ADD TO CART
// ============================
router.post("/addcart", async (req, res) => {
  try {
    let { userId, foodId, quantity } = req.body;
    quantity = Number(quantity || 1);

    if (!mongoose.Types.ObjectId.isValid(foodId)) {
      return res.status(400).json({ error: "Invalid foodId" });
    }

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }

    const existing = await Cart.findOne({ userId, foodId });

    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res.json({ success: true, message: "Cart updated" });
    }

    const newCart = new Cart({
      userId,
      foodId,
      quantity,
      price: food.price,
    });

    await newCart.save();

    res.json({ success: true, message: "Added to cart" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============================
// 📦 GET CART
// ============================
router.get("/getcart/:userId", async (req, res) => {
  try {
    const cartItems = await Cart.find({
      userId: req.params.userId,
    }).populate("foodId", "itemname image1 price");

    res.json({ data: cartItems });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============================
// 💰 CART TOTAL
// ============================
router.get("/cart-total/:userId", async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.params.userId });

    const total = cartItems.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      return sum + price * qty;
    }, 0);

    res.json({
      success: true,
      totalAmount: total,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============================
// ❌ REMOVE ITEM
// ============================
router.delete("/removecart/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Item removed",
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============================
// 💳 CREATE RAZORPAY ORDER
// ============================
router.post("/payment/order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount required" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "order_" + Date.now(),
    });

    res.json(order);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});
// ============================
// 🔐 VERIFY PAYMENT
// ============================
router.post("/payment/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", "PUT_YOUR_NEW_SECRET_KEY_HERE")
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.json({ success: true });
    } else {
      return res.status(400).json({ success: false });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============================
// 📦 PLACE ORDER (COD + ONLINE)
// ============================
router.post("/order", async (req, res) => {
  try {
    const {
      userId,
      cart,
      address,
      paymentMethod,
      paymentId,
    } = req.body;

    if (!userId || !cart || cart.length === 0) {
      return res.status(400).json({ error: "Invalid data" });
    }

    let totalAmount = 0;

    for (let item of cart) {
      const food = await Food.findById(item.foodId);
      if (!food) continue;

      totalAmount += food.price * item.quantity;
    }

    const newOrder = new Order({
      userId,
      items: cart,
      totalAmount,
      address,
      paymentMethod,
      paymentId: paymentId || null,
      status: "pending",
    });

    await newOrder.save();

    // 🛒 clear cart
    await Cart.deleteMany({ userId });

    res.json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });

  } catch (err) {
    console.log("Order Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;