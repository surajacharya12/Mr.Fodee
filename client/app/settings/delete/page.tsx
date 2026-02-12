"use client";

import React, { useState } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { ChevronLeft, AlertTriangle, Trash2, X, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { userApi } from "@/lib/api";

export default function DeleteAccountPage() {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmText === "DELETE") {
      setIsDeleting(true);
      
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          await userApi.delete(user.id || user._id);
          
          // Clear local storage and redirect
          localStorage.removeItem("user");
          // Optionally clear token if you have one separately
          
          setTimeout(() => {
            router.push("/signup");
          }, 1500);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please try again.");
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {isDeleting && (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center">
           <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-6" />
           <p className="text-xl font-black text-gray-800">Deleting your account...</p>
           <p className="text-gray-400 font-medium mt-2">We're sorry to see you go.</p>
        </div>
      )}

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

          <div className="bg-white rounded-[3rem] border-4 border-red-50 shadow-xl shadow-red-100/50 overflow-hidden p-10 md:p-14 text-center">
            <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center text-[#EE4444] mx-auto mb-10 shadow-inner">
               <AlertTriangle className="w-12 h-12" />
            </div>

            <h1 className="text-4xl font-black text-[#2D2D2D] mb-6">Are you absolutely sure?</h1>
            
            <div className="bg-red-50/50 rounded-2xl p-6 mb-10 text-left border border-red-100 flex gap-4">
               <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
               <div className="space-y-4">
                  <p className="text-red-900 font-black text-lg leading-tight">This action is permanent and cannot be undone.</p>
                  <ul className="text-red-700/70 text-sm font-bold space-y-2 list-disc ml-4">
                    <li>All your order history will be wiped.</li>
                    <li>Your Fodee points and wallet balance will be lost.</li>
                    <li>You will lose all saved addresses and cards.</li>
                    <li>You will be signed out from all devices.</li>
                  </ul>
               </div>
            </div>

            <div className="space-y-6">
               <p className="text-gray-500 font-black text-xs uppercase tracking-[0.2em]">To confirm, please type <span className="text-red-500">DELETE</span> below:</p>
               <input 
                type="text" 
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                placeholder="Type here..."
                className="w-full h-16 px-8 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-red-500 transition-all font-black text-center text-xl text-gray-800 outline-none"
               />

               <div className="flex flex-col md:flex-row gap-4">
                  <button 
                    onClick={() => router.back()}
                    className="flex-1 h-16 rounded-2xl bg-gray-100 text-gray-500 font-black text-lg hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDelete}
                    disabled={confirmText !== "DELETE"}
                    className={`flex-1 h-16 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all ${
                      confirmText === "DELETE" 
                      ? "bg-red-500 text-white shadow-xl shadow-red-500/30 hover:scale-105" 
                      : "bg-gray-50 text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete Account
                  </button>
               </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
