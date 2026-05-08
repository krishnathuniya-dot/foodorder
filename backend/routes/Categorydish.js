const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Category = require("../model/category"); 
const bcrypt = require("bcryptjs");
const Food = require("../model/food");

router.post("/category", async (req, res) => {
  try {
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const saveCategory = await Category.findOneAndUpdate(
      { category },
      { category },
      {
        new: true,
        upsert: true,
      }
    );

    res.status(200).json({
      message: "Category created",
      data: saveCategory,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/categorydata", async (req, res) => {
  try {
    const brandes = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({
      total: Category.length,
      data: brandes,
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

router.get("/fooddata/:category", async (req, res) => {
  try {
    const category = req.params.category.trim().toLowerCase();
    console.log("Category from frontend:", category);

    const data = await Food.find({
      foodcategory: { $regex: new RegExp(`^${category}$`, "i") }
    });

    if (!data.length) {
      return res.status(404).json({ message: "No food item found" });
    }

    res.json({ message: "products", data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;