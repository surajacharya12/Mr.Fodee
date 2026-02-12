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

// CORS configuration for production
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
    'https://mr-fodee.vercel.app',
    'https://mr-fodee-admin.vercel.app',
    /\.vercel\.app$/,
    
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection with serverless optimization
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

connectDB();

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
