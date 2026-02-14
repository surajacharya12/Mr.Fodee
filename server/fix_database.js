require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./module/user");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

const fixDatabase = async () => {
  await connectDB();
  
  console.log("\n" + "=".repeat(70));
  console.log("🔧 FIXING DATABASE - REMOVING CORRUPTED PROFILE PICTURE URL");
  console.log("=".repeat(70));
  
  try {
    const user = await User.findOne({ username: "Suraj Acharya" });
    
    if (user) {
      console.log("\n📋 Current User Data:");
      console.log("   Username:", user.username);
      console.log("   Current profilePictureUrl:", JSON.stringify(user.profilePictureUrl));
      
      // Check if it's the corrupted value
      if (user.profilePictureUrl === "05c14720fa" || 
          !user.profilePictureUrl || 
          user.profilePictureUrl === "" ||
          (user.profilePictureUrl && !user.profilePictureUrl.startsWith('http'))) {
        
        console.log("\n⚠️  FIXING: Resetting corrupted/invalid profilePictureUrl");
        
        user.profilePictureUrl = "";
        await user.save();
        
        console.log("✅ Reset complete!");
        console.log("   New profilePictureUrl:", JSON.stringify(user.profilePictureUrl));
      } else {
        console.log("\n✅ Profile picture URL is valid (starts with http)");
        console.log("   No fix needed.");
      }
      
      console.log("\n" + "=".repeat(70));
      console.log("📋 NEXT STEPS:");
      console.log("=".repeat(70));
      console.log("1. RESTART SERVER:");
      console.log("   cd server");
      console.log("   # Press Ctrl+C to stop");
      console.log("   npm run dev");
      console.log("");
      console.log("2. RESTART CLIENT:");
      console.log("   cd client");
      console.log("   # Press Ctrl+C to stop");
      console.log("   npm run dev");
      console.log("");
      console.log("3. OPEN BROWSER:");
      console.log("   - Go to http://localhost:3002");
      console.log("   - Login");
      console.log("   - Go to Profile page");
      console.log("   - Upload a profile picture");
      console.log("");
      console.log("4. VERIFY:");
      console.log("   cd server");
      console.log("   node monitor_user.js");
      console.log("");
      console.log("The new code will:");
      console.log("   ✅ Log the complete Cloudinary response");
      console.log("   ✅ Validate the URL format before saving");
      console.log("   ✅ Reject invalid URLs with clear error messages");
      console.log("   ✅ Only save proper Cloudinary URLs to database");
      console.log("=".repeat(70) + "\n");
      
    } else {
      console.log("❌ User 'Suraj Acharya' not found.");
    }
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    mongoose.connection.close();
  }
};

fixDatabase();
