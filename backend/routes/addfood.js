const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Food = require("../model/food");
const upload = require("../middleware/multer");

// =====================================================
// ADD FOOD
// =====================================================

router.post(
  "/addfood",
  upload.single("image1"),
  async (req, res) => {
    try {
      console.log("🔥 ADDFOOD API HIT");
      console.log("FILE:", req.file);
      console.log("BODY:", req.body);

      const {
        foodcategory,
        itemname,
        description,
        quantity,
        price,
      } = req.body;

      // Required fields
      if (!itemname || !price) {
        return res.status(400).json({
          success: false,
          message: "Item name and price are required",
        });
      }

      // Image required
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Food image is required",
        });
      }

      const newItem = new Food({
        foodcategory,
        itemname,
        description,
        quantity,
        price,

        // Cloudinary URL
        image1: req.file.path,
      });

      await newItem.save();

      res.status(201).json({
        success: true,
        message: "Item added successfully",
        data: newItem,
      });

    } catch (error) {
      console.error("ADD FOOD ERROR:", error);

      res.status(500).json({
        success: false,
        message: "Server error while adding item",
        error: error.message,
      });
    }
  }
);

// =====================================================
// GET ALL FOOD
// =====================================================

router.get("/Fooddata", async (req, res) => {
  try {
    const foods = await Food.find().sort({
      createdAt: -1,
    });

    const total = await Food.countDocuments();

    res.status(200).json({
      success: true,
      total,
      data: foods,
    });

  } catch (err) {
    console.error("GET FOOD ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

// =====================================================
// GET SINGLE FOOD
// =====================================================

router.get("/foodadd/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid food ID",
      });
    }

    const food = await Food.findById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    res.status(200).json({
      success: true,
      data: food,
    });

  } catch (error) {
    console.error("GET SINGLE FOOD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// UPDATE FOOD
// =====================================================

router.put(
  "/updatefood/:id",
  upload.single("image1"),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid food ID",
        });
      }

      const existingFood = await Food.findById(id);

      if (!existingFood) {
        return res.status(404).json({
          success: false,
          message: "Food item not found",
        });
      }

      const {
        foodcategory,
        itemname,
        description,
        quantity,
        price,
      } = req.body;

      const updatedData = {
        foodcategory:
          foodcategory !== undefined
            ? foodcategory
            : existingFood.foodcategory,

        itemname:
          itemname !== undefined
            ? itemname
            : existingFood.itemname,

        description:
          description !== undefined
            ? description
            : existingFood.description,

        quantity:
          quantity !== undefined
            ? quantity
            : existingFood.quantity,

        price:
          price !== undefined
            ? price
            : existingFood.price,

        // New Cloudinary image
        // Otherwise old image remains
        image1: req.file
          ? req.file.path
          : existingFood.image1,
      };

      const updatedFood = await Food.findByIdAndUpdate(
        id,
        updatedData,
        {
          new: true,
          runValidators: true,
        }
      );

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

// =====================================================
// SEARCH FOOD
// =====================================================

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;

    let foods;

    // No search query
    if (!query || query.trim() === "") {
      foods = await Food.find().sort({
        createdAt: -1,
      });

      return res.status(200).json({
        success: true,
        foods,
      });
    }

    const searchQuery = query.trim();

    // Check MongoDB ObjectId
    const isMongoId = mongoose.Types.ObjectId.isValid(searchQuery);

    if (isMongoId) {
      const food = await Food.findById(searchQuery);

      foods = food ? [food] : [];
    } else {
      // Search by itemname
      foods = await Food.find({
        itemname: {
          $regex: searchQuery,
          $options: "i",
        },
      }).sort({
        createdAt: -1,
      });
    }

    res.status(200).json({
      success: true,
      foods,
    });

  } catch (err) {
    console.error("SEARCH FOOD ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
});

// =====================================================
// EXPORT
// =====================================================

module.exports = router;