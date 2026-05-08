const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: String,

  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food",
    required: true,
  },

  quantity: {
    type: Number,
    default: 1,
  },

  total: {
    type: Number,
    default: 0,
  },
    price: Number,

});

module.exports = mongoose.model("Cart", cartSchema);