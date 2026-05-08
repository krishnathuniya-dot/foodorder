const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
        },
        itemname: String,
        price: Number,
        quantity: Number,
        total: Number,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    address: {
      flat: String,
      street: String,
      area: String,
      landmark: String,
      city: String,
    },

    status: {
      type: String,
       enum: ["Pending", "accepted", "Preparing", "Out for Delivery", "Delivered"],
      default: "Pending",
    },
     restaurantRemark: {
      type: String,
      default: "",
    },


    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      default: "COD",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);