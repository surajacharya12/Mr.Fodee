"use client";

import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import OfferBanner from "../components/offers";
import { Sparkles, Gift, Zap } from "lucide-react";

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Banner */}
        <div className="max-w-screen-2xl mx-auto px-4 md:px-4 text-center py-20 bg-[#2D2D2D] rounded-[3rem] mb-16 text-white overflow-hidden relative">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#EE4444]/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] animate-pulse" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-bold tracking-widest uppercase">
                Hot Deals Only
              </span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black mb-6">
              Exclusive <span className="text-[#EE4444]">Rewards</span> <br />
              For Food Lovers
            </h1>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Save big on your favorite meals. We've partnered with top
              restaurants to bring you the best deals in town.
            </p>
          </div>
        </div>

        {/* Active Offers */}
        <OfferBanner />

        {/* Extra Promotion */}
        <div className="max-w-screen-2xl mx-auto px-4 md:px-4 grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-indigo-800 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4">Refer a Friend</h3>
              <p className="text-indigo-100 mb-8 max-w-xs">
                Give $10, Get $10. Spread the joy of good food with your
                friends.
              </p>
              <button className="px-8 py-3 bg-white text-indigo-700 font-bold rounded-full hover:scale-105 transition-all">
                Invite Now
              </button>
            </div>
            <Gift className="absolute -right-8 -bottom-8 w-48 h-48 text-white/10 group-hover:rotate-12 transition-transform duration-700" />
          </div>

          <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-[#EE4444] to-red-700 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4">Flash Sales</h3>
              <p className="text-red-100 mb-8 max-w-xs">
                Limited time offers every Thursday at 6:00 PM. Don't miss out!
              </p>
              <button className="px-8 py-3 bg-white text-red-700 font-bold rounded-full hover:scale-105 transition-all">
                Set Reminder
              </button>
            </div>
            <Zap className="absolute -right-8 -bottom-8 w-48 h-48 text-white/10 group-hover:-rotate-12 transition-transform duration-700" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
