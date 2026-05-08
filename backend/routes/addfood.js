const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Food = require("../model/food");
const upload = require("../middleware/multer"); 


router.post(
  "/addfood",
  upload.single("image1"), 
  async (req, res) => {
    try {
      console.log("FILE:", req.file);
      console.log("BODY:", req.body);

      const {
        foodcategory,
        itemname,
        description,
        quantity,
        price,
      } = req.body;

    
      if (!itemname || !price) {
        return res.status(400).json({
          success: false,
          message: "Item name and price are required",
        });
      }

      const newItem = new Food({
        foodcategory,
        itemname,
        description,
        quantity,
        price,
        image1: req.file ? req.file.filename : "",
      });

      await newItem.save();

      res.status(201).json({
        success: true,
        message: "Item added successfully",
        data: newItem,
      });

    } catch (error) {
      console.error("Add Item Error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while adding item",
        error: error.message,
      });
    }
  }
);
router.get("/Fooddata", async (req, res) => {
  try {
    const brandes = await Food.find().sort({ createdAt: -1 });

    res.status(200).json({
      total: Food.length,
      data: brandes,
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});
router.get("/foodadd/:id", async (req, res) => {
  try {
    const { id } = req.params;

   
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid food ID" });
    }

   
    const food = await Food.findById(id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    
    res.status(200).json({
      success: true,
      data: food,
    });

  } catch (error) {
    console.error("GET FOOD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});
router.put(
  "/updatefood/:id",
  upload.single("image1"), 
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid food ID" });
      }

      const existingFood = await Food.findById(id);

      if (!existingFood) {
        return res.status(404).json({ message: "Food item not found" });
      }

      const {
        foodcategory,
        itemname,
        description,
        quantity,
        price,
      } = req.body;

      const updatedData = {
        foodcategory: foodcategory || existingFood.foodcategory,
        itemname: itemname || existingFood.itemname,
        description: description || existingFood.description,
        quantity: quantity || existingFood.quantity,
        price: price || existingFood.price,
        image1: req.file ? req.file.filename : existingFood.image1,
      };

      const updatedFood = await Food.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        success: true,
        message: "Food updated successfully",
        data: updatedFood,
      });

    } catch (error) {
      console.error("UPDATE FOOD ERROR:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating food",
        error: error.message,
      });
    }
  }
);
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;

    let foods;

    // 👉 Agar query nahi aayi → saare foods return
    if (!query) {
      foods = await Food.find();
      return res.json({ success: true, foods });
    }

    // 👉 Check MongoDB ObjectId
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(query);

    if (isMongoId) {
      const food = await Food.findById(query);
      foods = food ? [food] : [];
    } else {
      // 👉 Name search (partial + case insensitive)
      foods = await Food.find({
        name: { $regex: query, $options: "i" }
      });
    }

    res.json({ success: true, foods });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message
    });
  }
});

module.exports = router;