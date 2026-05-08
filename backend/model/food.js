const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    foodcategory: {
      type: String,
      required: true,
      trim: true,
    },

    itemname: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image1: {
      type: String, // ✅ FIXED
      default: "",
    },

    quantity: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);