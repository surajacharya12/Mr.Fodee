"use client";

import React, { useState } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { ChevronLeft, Lock, Eye, EyeOff, Save, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { userApi } from "@/lib/api";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        alert("Please login first");
        router.push("/login");
        return;
      }
      
      const user = JSON.parse(userStr);
      await userApi.updatePassword(user.id || user._id, {
        currentPassword,
        newPassword
      });
      
      alert("Password updated successfully");
      router.push("/settings");
    } catch (error: any) {
      console.error("Failed to update password:", error);
      alert(error.response?.data?.error || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-[#EE4444] font-bold mb-8 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Settings
          </button>

          <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden p-8 md:p-12">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#EE4444] flex items-center justify-center shadow-inner">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-[#2D2D2D]">Change Password</h1>
                <p className="text-gray-400 font-medium">Keep your account secure</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                <div className="relative">
                  <input 
                    type={showCurrent ? "text" : "password"} 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all font-bold text-gray-700 outline-none"
                    placeholder="••••••••"
                  />
                  <button 
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                <div className="relative">
                  <input 
                    type={showNew ? "text" : "password"} 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all font-bold text-gray-700 outline-none"
                    placeholder="••••••••"
                  />
                  <button 
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 font-bold px-1 italic">Min. 6 characters.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                <div className="relative">
                  <input 
                    type={showConfirm ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all font-bold text-gray-700 outline-none"
                    placeholder="••••••••"
                  />
                  <button 
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={handleUpdatePassword}
              disabled={loading}
              className="w-full mt-12 h-16 bg-[#EE4444] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-red-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {loading ? "Updating..." : "Update Password"}
            </button>
            
            <div className="mt-8 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
               <ShieldCheck className="w-5 h-5 text-emerald-500" />
               <p className="text-xs text-emerald-700 font-bold">Your information is encrypted and never shared.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
