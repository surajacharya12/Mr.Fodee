"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/api";
import { Lock, Mail, ChevronRight, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await adminApi.login({ email, password });
      
      // Save token and admin info
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.admin));
      
      router.push("/");
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.response?.data?.error || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100 relative overflow-hidden">
         {/* Decorative Background */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-[#EE4444]/10 rounded-full blur-3xl -mr-16 -mt-16" />
         <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -ml-16 -mb-16" />

         <div className="relative z-10 text-center mb-10">
            <h1 className="text-3xl font-black text-[#2D2D2D] tracking-tight mb-2">Fodee<span className="text-[#EE4444]">Admin</span></h1>
            <p className="text-gray-400 font-medium">Secure Access Portal</p>
         </div>

         {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold border border-red-100">
               <AlertCircle className="w-5 h-5 shrink-0" />
               {error}
            </div>
         )}

         <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-2">
               <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-4">Admin Email</label>
               <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 pl-14 pr-6 bg-gray-50 border border-transparent rounded-2xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all outline-none"
                    placeholder="admin@fodee.com"
                    required
                  />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-4">Password</label>
               <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 pl-14 pr-6 bg-gray-50 border border-transparent rounded-2xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all outline-none"
                    placeholder="••••••••"
                    required
                  />
               </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-[#EE4444] text-white rounded-2xl font-black text-lg shadow-xl shadow-red-500/30 hover:shadow-red-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? (
                 <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                 <>
                   Login to Dashboard
                   <ChevronRight className="w-5 h-5 opacity-60" />
                 </>
              )}
            </button>
         </form>

         <div className="mt-8 text-center text-xs text-gray-300 font-bold uppercase tracking-widest">
            Protected Area • Authorized Personnel Only
         </div>
      </div>
    </div>
  );
}
