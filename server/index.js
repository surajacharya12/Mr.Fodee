const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const users = require("./route/user");
const upload = require("./route/upload");
const restaurantRoutes = require("./route/resturent");
const offerRoutes = require("./route/offer");
const adminRoutes = require("./route/admin");
const foodRoutes = require("./route/food");
const favoritesRoutes = require("./route/favorites");
const categoryRoutes = require("./route/category");
const reviewRoutes = require("./route/review");



const app = express(); 

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Mr.Fodee API is running");
});

app.use("/user", users); 
app.use("/upload", upload);
app.use("/restaurant", restaurantRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/offer", offerRoutes);
app.use("/admin", adminRoutes);
app.use("/food", foodRoutes);
app.use("/favorites", favoritesRoutes);
app.use("/category", categoryRoutes);
app.use("/review", reviewRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
