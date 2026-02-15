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
const notificationRoutes = require("./route/notification");
const cartRoutes = require("./route/cart");
const orderRoutes = require("./route/order");
const paymentRoutes = require("./route/payment");
const riderRoutes = require("./route/rider");
const http = require("http");
const { Server } = require("socket.io");


const app = express(); 
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST"]
  }
});

// Socket.io logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on("updateLocation", async (data) => {
    const { riderId, latitude, longitude } = data;
    // We could emit this to customers tracking the rider
    io.emit(`locationUpdate_${riderId}`, { latitude, longitude });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Attach io to req for use in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

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
app.use("/notification", notificationRoutes);
app.use("/notifications", notificationRoutes);
app.use("/cart", cartRoutes);
app.use("/carts", cartRoutes);
app.use("/order", orderRoutes);
app.use("/orders", orderRoutes);
app.use("/payment", paymentRoutes);
app.use("/rider", riderRoutes);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running with Socket.io on port ${PORT}`);
});

module.exports = app;
