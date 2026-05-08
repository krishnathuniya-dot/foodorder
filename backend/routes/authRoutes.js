const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../model/user");
const bcrypt = require("bcryptjs");




router.post("/signup", async (req, res) => {
  const { firstName,LastName, email, password,contact  } = req.body;

  try {
    if (!firstName || !email || !password || !contact) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      LastName,
      email,
      password: hashedPassword,
      contact,
     
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
       
        name: newUser.firstName,
        email: newUser.LastName,
        contact: newUser.contact,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
router.get("/reguser", async (req, res) => {
  try {
    const brandes = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      total: User.length,
      data: brandes,
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});
router.get("/reguser/user/count", async (req, res) => {
  try {
    const count = await User.countDocuments();

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
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

   

    res.status(200).json({
      success: true,
      message: "Login successful",
     
      user: {
        _id: user._id,   // ✅ FIXED
        name: user.name,
        email: user.email,
        contact: user.contact,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
router.get("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Requested ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
      
      
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
router.put("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName,  LastName,email, contact,  } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstName,LastName, contact, email },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      
      
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
router.post("/changepassword", async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    if (!userId || !oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({
        message: "New password cannot be same as old",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;