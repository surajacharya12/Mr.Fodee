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

const monitorUser = async () => {
  await connectDB();
  
  console.log("\n" + "=".repeat(60));
  console.log("📊 USER PROFILE MONITOR");
  console.log("=".repeat(60));
  
  try {
    const user = await User.findOne({ username: "Suraj Acharya" });
    
    if (user) {
      console.log("\n📋 Current User Data:");
      console.log("   ID:", user._id);
      console.log("   Username:", user.username);
      console.log("   Email:", user.email);
      console.log("   Phone:", user.phoneNumber);
      console.log("   Profile Picture:", user.profilePictureUrl || "(empty)");
      
      console.log("\n" + "=".repeat(60));
      console.log("🔍 PROFILE PICTURE STATUS");
      console.log("=".repeat(60));
      
      if (!user.profilePictureUrl || user.profilePictureUrl === "") {
        console.log("Status: ⚪ NO PROFILE PICTURE");
        console.log("\n📝 Next Steps:");
        console.log("   1. Open http://localhost:3002 in your browser");
        console.log("   2. Login with your credentials");
        console.log("   3. Go to Profile page");
        console.log("   4. Click the edit icon on your profile picture");
        console.log("   5. Select an image file");
        console.log("   6. Open browser DevTools Console (F12)");
        console.log("   7. Watch for the upload logs");
        console.log("\n   Expected Console Output:");
        console.log("   === FILE UPLOAD STARTED ===");
        console.log("   File name: your-image.jpg");
        console.log("   === UPLOAD RESPONSE ===");
        console.log("   === UPDATING USER PROFILE ===");
        console.log("   ✅ UPLOAD COMPLETE");
      } else if (user.profilePictureUrl.includes("cloudinary.com/fake")) {
        console.log("Status: ⚠️  TEST URL DETECTED");
        console.log("Action: Resetting to empty...");
        user.profilePictureUrl = "";
        await user.save();
        console.log("✅ Reset complete. Try uploading again.");
      } else if (user.profilePictureUrl.includes("res.cloudinary.com")) {
        console.log("Status: ✅ REAL CLOUDINARY URL");
        console.log("URL:", user.profilePictureUrl);
        console.log("\n🎉 Profile picture is successfully uploaded!");
      } else {
        console.log("Status: ⚠️  UNKNOWN URL FORMAT");
        console.log("URL:", user.profilePictureUrl);
      }
      
      console.log("\n" + "=".repeat(60));
      console.log("🔧 TROUBLESHOOTING");
      console.log("=".repeat(60));
      console.log("If upload is not working:");
      console.log("   1. Check server is running on port 3001");
      console.log("   2. Check client is running on port 3002");
      console.log("   3. Check browser console for errors");
      console.log("   4. Check server terminal for upload logs");
      console.log("   5. Verify Cloudinary credentials in server/.env");
      console.log("\n   Server should show:");
      console.log("   'File uploaded to Cloudinary: { ... }'");
      console.log("\n" + "=".repeat(60));
      
    } else {
      console.log("❌ User 'Suraj Acharya' not found.");
      const users = await User.find({}, 'username');
      console.log("Available users:", users.map(u => u.username));
    }
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    mongoose.connection.close();
  }
};

monitorUser();
