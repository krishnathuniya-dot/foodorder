// =====================================================
// LOAD ENVIRONMENT VARIABLES
// =====================================================

require("dotenv").config({
  path: require("path").join(__dirname, ".env"),
});

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const cors = require("cors");

// =====================================================
// ROUTES
// =====================================================

const authRoutes = require("./routes/authRoutes");
const category = require("./routes/Categorydish");
const addfood = require("./routes/addfood");
const cart = require("./routes/cartt");
const addressRoutes = require("./routes/addressRoutes");

// =====================================================
// CHECK ENV VARIABLES
// =====================================================

console.log("MONGO_URI loaded:", !!process.env.MONGO_URI);
console.log(
  "CLOUDINARY_CLOUD_NAME loaded:",
  !!process.env.CLOUDINARY_CLOUD_NAME
);

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// ROUTES
// =====================================================

app.use("/api", authRoutes);
app.use("/api", addressRoutes);
app.use("/api", category);
app.use("/api", addfood);
app.use("/api", cart);

// =====================================================
// MONGODB CONNECTION
// =====================================================

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing!");
  console.error("❌ Please check backend/.env file");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// =====================================================
// SERVER
// =====================================================

const PORT = process.env.PORT || 2340;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});