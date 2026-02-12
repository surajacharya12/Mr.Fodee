"use client";

import React, { useState, useEffect } from "react";
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
  const { logout } = useAuth();
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

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Here you would typically upload to your server
      // For now, we'll just show the preview
      // TODO: Implement actual image upload to server
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
                  <img 
                    src={imagePreview || userData.profilePictureUrl} 
                    alt={userData.username} 
                    className="w-full h-full object-cover"
                  />
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
