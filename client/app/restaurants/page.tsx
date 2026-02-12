"use client";

import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import RestaurantSection from "../components/restaurants";
import { Search, MapPin } from "lucide-react";

export default function RestaurantsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Search Header */}
        <div className="bg-white border-b border-gray-100 py-12 mb-10">
          <div className="max-w-screen-2xl mx-auto px-4 md:px-4">
            <h1 className="text-4xl font-black text-[#2D2D2D] mb-6">Explore All Restaurants</h1>
            
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#EE4444]" />
                <input 
                  type="text" 
                  placeholder="Search for restaurants, cuisines or dishes..."
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-[#EE4444]/10 focus:border-[#EE4444] transition-all"
                />
              </div>
              
              <div className="relative w-full md:w-64 group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#EE4444]" />
                <input 
                  type="text" 
                  placeholder="Change location..."
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-[#EE4444]/10 focus:border-[#EE4444] transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-4 md:px-4">
           <RestaurantSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
