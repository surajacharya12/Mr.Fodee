"use client";

import React, { useState, useEffect } from "react";
import { userApi, uploadApi } from "../../lib/api";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { 
  User, 
  MapPin, 
  CreditCard, 
  Bell, 
  Tag, 
  HelpCircle, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  ChevronRight,
  Edit2,
  Star,
  Clock,
  History
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";


export default function ProfilePage() {
  const router = useRouter();
  const { logout, updateUser } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [promotions, setPromotions] = useState(true);
  const [userData, setUserData] = useState({
    id: "",
    username: "Guest User",
    email: "guest@example.com",
    profilePictureUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
    phoneNumber: "",
    createdAt: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Fetch user data on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData(user);
      if (user.profilePictureUrl) {
        setImagePreview(user.profilePictureUrl);
      }
    }
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    router.push("/");
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userData?.username) return "U";
    const names = userData.username.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return userData.username.substring(0, 2).toUpperCase();
  };

  // Handle image upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }
    
    console.log("=== FILE UPLOAD STARTED ===");
    console.log("File name:", file.name);
    console.log("File size:", file.size, "bytes");
    console.log("File type:", file.type);
    
    setImageFile(file);
    
    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log("Preview loaded");
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    try {
      const loadingToast = toast.loading("Uploading profile picture...");
      
      console.log("Calling uploadApi.uploadFile...");
      
      // Upload to server
      const uploadRes = await uploadApi.uploadFile(file);
      
      console.log("=== UPLOAD RESPONSE ===");
      console.log("Status:", uploadRes.status);
      console.log("Full response data:", JSON.stringify(uploadRes.data, null, 2));
      
      const imageUrl = uploadRes.data.url;
      
      console.log("Extracted imageUrl:", imageUrl);
      console.log("Type of imageUrl:", typeof imageUrl);
      console.log("Length of imageUrl:", imageUrl?.length);
      
      // CRITICAL: Validate it's a proper Cloudinary URL
      if (!imageUrl) {
          console.error("❌ Upload failed: No URL in response", uploadRes.data);
          throw new Error("Failed to upload image: Server returned no URL");
      }
      
      if (typeof imageUrl !== 'string') {
          console.error("❌ Upload failed: URL is not a string", typeof imageUrl);
          throw new Error("Failed to upload image: Invalid URL type");
      }
      
      if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
          console.error("❌ Upload failed: URL does not start with http:// or https://");
          console.error("Received:", imageUrl);
          throw new Error(`Failed to upload image: Invalid URL format (got: ${imageUrl.substring(0, 50)}...)`);
      }
      
      if (!imageUrl.includes('cloudinary.com')) {
          console.error("❌ Upload failed: URL is not from Cloudinary");
          console.error("Received:", imageUrl);
          throw new Error("Failed to upload image: Not a Cloudinary URL");
      }
      
      console.log("✅ URL validation passed!");
      console.log("Valid Cloudinary URL:", imageUrl);
      
      console.log("=== UPDATING USER PROFILE ===");
      console.log("User ID:", userData.id);
      console.log("New profilePictureUrl:", imageUrl);
      
      // Update user profile
      if (userData.id) {
         const updateRes = await userApi.update(userData.id, { 
           profilePictureUrl: imageUrl 
         });
         
         console.log("=== UPDATE RESPONSE ===");
         console.log("Response status:", updateRes.status);
         console.log("Updated user from server:", updateRes.data);
         console.log("Server returned profilePictureUrl:", updateRes.data.profilePictureUrl);
         
         // Verify the server actually saved the URL
         if (updateRes.data.profilePictureUrl !== imageUrl) {
            console.error("⚠️ WARNING: Server returned different profilePictureUrl!");
            console.error("Expected:", imageUrl);
            console.error("Got:", updateRes.data.profilePictureUrl);
            throw new Error("Server did not save the profile picture correctly");
         }
         
         console.log("✅ Server confirmed profilePictureUrl saved correctly");
         
         // Update local state and context ONLY after server confirms
         const updatedUser = { ...userData, profilePictureUrl: imageUrl };
         setUserData(updatedUser);
         updateUser(updatedUser);
         
         toast.dismiss(loadingToast);
         toast.success("Profile picture updated successfully!");
         console.log("✅ UPLOAD COMPLETE");
      }
    } catch (err: any) {
      console.error("=== UPLOAD ERROR ===");
      console.error("Error:", err);
      console.error("Error message:", err.message);
      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data);
      }
      toast.dismiss();
      toast.error(err.response?.data?.error || err.message || "Failed to update profile picture");
    }
  };

  const stats = [
    { label: "Orders", value: "24", icon: History },
    { label: "Reviews", value: "12", icon: Star },
    { label: "Points", value: "1,250", icon: Tag }, // Custom points icon
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="pt-16 pb-20">
        {/* Profile Header */}
        <div className="bg-[#EE4444] pt-20 pb-24 md:pb-32 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              <div className="relative group">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden shadow-2xl">
                  {(imagePreview || userData.profilePictureUrl) ? (
                    <img 
                      src={imagePreview || userData.profilePictureUrl} 
                      alt={userData.username} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-premium flex items-center justify-center">
                      <span className="text-white font-black text-4xl">{getUserInitials()}</span>
                    </div>
                  )}
                </div>
                <label htmlFor="profile-image-upload" className="absolute bottom-1 right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg text-[#EE4444] hover:scale-110 transition-transform cursor-pointer">
                  <Edit2 className="w-4 h-4" />
                  <input 
                    id="profile-image-upload"
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="text-center md:text-left flex-1">
                <div className="flex flex-col md:flex-row items-center gap-3 mb-1">
                  <h1 className="text-3xl font-black text-white">{userData.username}</h1>
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/20">
                    Gold Member
                  </span>
                </div>
                <p className="text-white/80 font-medium">{userData.email}</p>
              </div>

              <Link href="/profile/edit">
                <button className="px-6 py-2.5 rounded-xl bg-white text-gray-800 font-bold hover:bg-gray-50 transition-colors shadow-lg">
                  Edit
                </button>
              </Link>
            </div>
          </div>
          
          {/* Abstract background shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full blur-2xl -ml-10 -mb-10" />
        </div>

        <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-10">
          {/* Stats Bar */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-gray-200/50 border border-gray-50 flex justify-between items-center mb-8">
            <div className="flex-1 text-center border-r border-gray-100">
              <p className="text-2xl font-black text-[#2D2D2D]">24</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Orders</p>
            </div>
            <div className="flex-1 text-center border-r border-gray-100">
              <p className="text-2xl font-black text-[#2D2D2D]">12</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Reviews</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-2xl font-black text-[#2D2D2D]">1,250</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Points</p>
            </div>
          </div>

          <div className="space-y-10">
            {/* Account Section */}
            <div>
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Account</h2>
              <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
                <Link href="/profile/edit"><ProfileOption icon={<User className="w-5 h-5" />} label="Edit Profile" /></Link>
                <Link href="/profile/addresses"><ProfileOption icon={<MapPin className="w-5 h-5" />} label="Saved Addresses" badge="3" /></Link>
                <Link href="/profile/payments"><ProfileOption icon={<CreditCard className="w-5 h-5" />} label="Payment Methods" isLast /></Link>
              </div>
            </div>

            {/* Preferences Section */}
            <div>
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Preferences</h2>
              <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors border-b border-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center">
                      <Bell className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-gray-700">Notifications</span>
                  </div>
                  <Toggle active={notifications} onToggle={() => setNotifications(!notifications)} />
                </div>
                <div className="flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center">
                      <Tag className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-gray-700">Offers & Promotions</span>
                  </div>
                  <Toggle active={promotions} onToggle={() => setPromotions(!promotions)} />
                </div>
              </div>
            </div>

            {/* Support Section */}
            <div>
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Support</h2>
              <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
                <Link href="/help"><ProfileOption icon={<HelpCircle className="w-5 h-5" />} label="Help Center" /></Link>
                <Link href="/privacy"><ProfileOption icon={<ShieldCheck className="w-5 h-5" />} label="Privacy Policy" /></Link>
                <Link href="/settings"><ProfileOption icon={<Settings className="w-5 h-5" />} label="Settings" isLast /></Link>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 py-6 text-[#EE4444] font-black border-2 border-red-50 rounded-4xl hover:bg-red-50 hover:border-red-100 transition-all active:scale-[0.98]"
            >
              <LogOut className="w-6 h-6" />
              Sign Out
            </button>
            <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-widest pb-10">Mr. Fodee v1.0.0</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ProfileOption({ icon, label, badge, value, isLast = false }: { 
  icon: React.ReactNode, 
  label: string, 
  badge?: string,
  value?: string,
  isLast?: boolean 
}) {
  return (
    <div className={`flex items-center justify-between p-6 hover:bg-gray-50 cursor-pointer transition-all active:bg-gray-100 group ${!isLast ? 'border-b border-gray-50' : ''}`}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center group-hover:text-[#EE4444] group-hover:bg-red-50 transition-colors">
          {icon}
        </div>
        <span className="font-bold text-gray-700 group-hover:text-gray-900">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        {badge && (
          <span className="w-5 h-5 rounded-full bg-[#EE4444] text-white text-[10px] font-black flex items-center justify-center shadow-lg shadow-[#EE4444]/20 animate-pulse">
            {badge}
          </span>
        )}
        {value && <span className="font-black text-emerald-500 text-sm tracking-tight">{value}</span>}
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#EE4444] group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
}

function Toggle({ active, onToggle }: { active: boolean, onToggle: () => void }) {
  return (
    <div 
      onClick={onToggle}
      className={`relative w-14 h-8 rounded-full transition-all duration-300 cursor-pointer ${active ? 'bg-[#EE4444] shadow-lg shadow-[#EE4444]/20' : 'bg-gray-200'}`}
    >
      <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-sm transition-all duration-300 transform ${active ? 'translate-x-6' : 'translate-x-0'}`} />
    </div>
  );
}
