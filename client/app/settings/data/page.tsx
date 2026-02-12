"use client";

import React, { useState } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { ChevronLeft, Eye, Database, Shield, Lock, ChevronRight, CheckCircle2, Download } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DataPrivacyPage() {
  const router = useRouter();
  const [reviewsVisible, setReviewsVisible] = useState(true);
  const [favoritesVisible, setFavoritesVisible] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-[#EE4444] font-bold mb-8 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Settings
          </button>

          <header className="mb-12">
            <h1 className="text-4xl font-black text-[#2D2D2D] mb-4">Data & Privacy</h1>
            <p className="text-gray-500 text-lg font-medium">Contol your data and manage how your info is shared.</p>
          </header>

          <div className="space-y-10">
            {/* Visibility Section */}
            <section>
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-6">Visibility</h2>
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                 <PrivacyToggle 
                    icon={<Eye className="w-5 h-5" />}
                    label="Public Reviews"
                    description="Allow others to see your restaurant reviews"
                    active={reviewsVisible}
                    onToggle={() => setReviewsVisible(!reviewsVisible)}
                 />
                 <PrivacyToggle 
                    icon={<Lock className="w-5 h-5" />}
                    label="Public Favorites"
                    description="Allow others to see your favorite restaurants"
                    active={favoritesVisible}
                    onToggle={() => setFavoritesVisible(!favoritesVisible)}
                    isLast
                 />
              </div>
            </section>

            {/* Data Export Section */}
            <section>
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-6">Data Management</h2>
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-8">
                 <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-inner shrink-0">
                       <Database className="w-10 h-10" />
                    </div>
                    <div className="text-center md:text-left">
                       <h3 className="text-xl font-black text-[#2D2D2D] mb-2">Download Your Data</h3>
                       <p className="text-gray-400 font-medium leading-relaxed mb-6">Receive a copy of your personal data, including your order history, profile settings, and saved addresses.</p>
                       <button className="h-14 px-8 bg-[#2D2D2D] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-gray-200 active:scale-[0.98]">
                          <Download className="w-5 h-5" />
                          Request Data Export
                       </button>
                    </div>
                 </div>
              </div>
            </section>

            {/* Privacy Assurance */}
            <div className="bg-emerald-50 rounded-[2rem] p-8 border border-emerald-100 relative overflow-hidden group">
               <div className="relative z-10 flex items-start gap-6">
                  <div className="w-12 h-12 rounded-xl bg-white text-emerald-500 flex items-center justify-center shadow-sm shrink-0">
                     <Shield className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-emerald-900 font-black text-lg mb-1">Your privacy is our priority</p>
                     <p className="text-emerald-700/60 text-sm font-medium leading-relaxed">We use industry-standard encryption to protect your data. We never sell your personal information to third parties.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function PrivacyToggle({ icon, label, description, active, onToggle, isLast = false }: any) {
  return (
    <div className={`p-8 flex items-center justify-between transition-all ${!isLast ? 'border-b border-gray-50' : ''}`}>
      <div className="flex items-center gap-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${active ? 'bg-red-50 text-[#EE4444]' : 'bg-gray-50 text-gray-400'}`}>
          {icon}
        </div>
        <div>
          <p className="text-lg font-black text-gray-800">{label}</p>
          <p className="text-sm text-gray-400 font-bold">{description}</p>
        </div>
      </div>
      <div 
        onClick={onToggle}
        className={`relative w-14 h-8 rounded-full transition-all duration-300 cursor-pointer ${active ? 'bg-[#EE4444] shadow-lg shadow-red-500/20' : 'bg-gray-200'}`}
      >
        <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 transform ${active ? 'translate-x-6' : 'translate-x-0'}`}>
          {active && <CheckCircle2 className="w-4 h-4 text-[#EE4444] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
        </div>
      </div>
    </div>
  );
}
