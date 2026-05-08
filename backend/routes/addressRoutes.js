const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");


const Order = require("../model/address");
const Cart = require("../model/cart");
const Food = require("../model/food");


const generateOrderNumber = () => {
  return "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
};

router.post("/order", async (req, res) => {
  try {
    const { userId, cart, address } = req.body;

    console.log("BODY 👉", req.body);

    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID required",
      });
    }

    if (!address || !address.city || !address.flat) {
      return res.status(400).json({
        success: false,
        message: "Complete address required",
      });
    }

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let items = [];
    let totalAmount = 0;

    
    for (let item of cart) {
      const food = await Food.findById(item.foodId);

      // ❗ agar food nahi mila to skip nahi — error do
      if (!food) {
        return res.status(400).json({
          success: false,
          message: `Food not found for id ${item.foodId}`,
        });
      }

      const price = Number(food.price || 0);
      const qty = Number(item.quantity || 1);

      const total = price * qty;

      items.push({
        foodId: food._id,
        itemname: food.itemname,
        price,
        quantity: qty,
        total,
      });

      totalAmount += total;
    }

    
    if (items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid items in cart",
      });
    }

    const order = new Order({
      orderNumber: generateOrderNumber(),
      userId,
      items,
      address,
      totalAmount,
    });

    await order.save();

   
    await Cart.deleteMany({ userId });

    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
      orderNumber: order.orderNumber,
      totalAmount,
    });

  } catch (err) {
    console.error("ORDER ERROR 👉", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
});
router.get("/orderdata", async (req, res) => {
  try {
    const brandes = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
      total: Order.length,
      data: brandes,
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});
router.get("/orders/:userId", async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});
router.get("/orders/order/:orderNumber", async (req, res) => {
  try {
    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
    }).populate("items.foodId")
     .populate("userId");     

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({ success: true, order });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});
// PUT - Update Status + Remark

router.put("/update-order/:id", async (req, res) => {
  try {
    const { status, restaurantRemark } = req.body;
    const orderId = req.params.id;

    console.log("Order ID:", orderId);
    console.log("Body:", req.body);

    
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID",
      });
    }

   
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        status,
        restaurantRemark,
      },
      { returnDocument: "after" } 
    )
      .populate("userId")
      .populate("items.foodId");

   
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    
    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
});



router.get("/order/:orderNumber", async (req, res) => {
  try {
    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
    })
      .populate("userId")
      .populate("items.foodId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      success: true,
      order,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/orderss/accepted-list/count", async (req, res) => {
  try {
    const count = await Order.countDocuments({ status: "accepted" });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/orderss/pendinglist", async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $regex: /^pending$/i }
    })
      .sort({ createdAt: -1 })
      .populate("userId")
      .populate("items.foodId");

    res.json({
      success: true,
      data: orders,
      total: orders.length
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.get("/orderss/pendinglist/count", async (req, res) => {
  try {
    const count = await Order.countDocuments({ status: "Pending" });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});



router.get("/orderss/deliverylist", async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $regex: /^delivered$/i }
    })
      .sort({ createdAt: -1 })
      .populate("userId")
      .populate("items.foodId");

    res.json({
      success: true,
      data: orders,
      total: orders.length
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/orderss/deliveredlist/count", async (req, res) => {
  try {
    const count = await Order.countDocuments({ status: "delivered" });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/orderss/outfordeliverylist", async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $regex: /^out_for_delivery$/i }
    })
      .sort({ createdAt: -1 })
      .populate("userId")
      .populate("items.foodId");

    res.json({
      success: true,
      data: orders,
      total: orders.length
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.get("/orderss/outfordeliverylist/count", async (req, res) => {
  try {
    const count = await Order.countDocuments({ status: "out_for_delivery" });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/orderss/preparinglist", async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $regex: /^preparing$/i }
    })
      .sort({ createdAt: -1 })
      .populate("userId")
      .populate("items.foodId");

    res.json({
      success: true,
      data: orders,
      total: orders.length
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.get("/orderss/preparinglist/count", async (req, res) => {
  try {
    const count = await Order.countDocuments({ status: "preparing" });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


router.get("/order/orderss/count", async (req, res) => {
  try {
    const count = await Order.countDocuments();

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/orderss/accepted-list", async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $regex: /^accepted$/i }
    })
      .sort({ createdAt: -1 })
      .populate("userId")
      .populate("items.foodId");

    res.json({
      success: true,
      data: orders,
      total: orders.length
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});
// Example Express Route
router.get("/searchh", async (req, res) => {
  try {
    // 1. Check karein ki query string mil rahi hai ya nahi
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ success: false, message: "Search term is required" });
    }

    // 2. Query ko string mein convert karein (Safety ke liye)
    const searchString = String(query);

    // 3. Database query chalayein
    const foods = await FoodModel.find({
      $or: [
        { itemname: { $regex: searchString, $options: "i" } }, // 'i' means case-insensitive
        { foodcategory: { $regex: searchString, $options: "i" } }
      ]
    });

    res.json({ success: true, foods });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});



module.exports = router;