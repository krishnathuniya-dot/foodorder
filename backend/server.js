const express = require("express")
const app = express();
const mongoose = require ("mongoose")
const cors = require ("cors")
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const category = require("./routes/Categorydish");
const addfood = require("./routes/addfood");
const cart = require("./routes/cartt");
const addressRoutes  = require("./routes/addressRoutes");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", addressRoutes);
app.use("/api", category);
app.use("/api", addfood);
app.use("/api", cart);


mongoose.connect("mongodb+srv://krishnathuniya_db_user:krishnathuniya12345@cluster0.6yreqku.mongodb.net/foodorder?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.listen(2340, () => {
  console.log("Server running on port 2340"); 
});