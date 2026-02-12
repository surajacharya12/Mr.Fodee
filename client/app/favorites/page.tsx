"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { 
  Heart, 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Clock, 
  ChevronRight,
  UtensilsCrossed,
  Plus
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { favoritesApi } from "@/lib/api";

export default function FavoritesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { data } = await favoritesApi.getAllByUser(user.id);
        setFavorites(data);
      } catch (err) {
        console.error("Failed to fetch favorites", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user]);

  const removeFavorite = async (foodId: string) => {
    if (!user) return;
    try {
      await favoritesApi.toggle({ user: user.id, food: foodId });
      setFavorites(prev => prev.filter(f => (f.food?._id || f.food) !== foodId));
    } catch (err) {
      console.error("Failed to remove favorite", err);
    }
  };

  const filteredFavorites = favorites.filter(fav => {
    const food = fav.food;
    if (!food) return false;
    return (
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-12">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-50 rounded-xl text-[#EE4444]">
                  <Heart className="w-6 h-6 fill-current" />
                </div>
                <h1 className="text-4xl font-black text-[#2D2D2D]">My Favorites</h1>
              </div>
              <p className="text-gray-500 font-medium">Your curated list of deliciousness</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative group flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#EE4444] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search your favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 pl-12 pr-6 rounded-2xl bg-white border border-gray-100 focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all font-medium text-gray-700 outline-none shadow-sm"
                />
              </div>
            </div>
          </div>

          {!user ? (
            <div className="bg-white rounded-[3rem] py-32 flex flex-col items-center text-center shadow-sm border border-gray-100 mb-20">
              <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center text-[#EE4444] mb-8">
                <Heart className="w-10 h-10 fill-current" />
              </div>
              <h2 className="text-3xl font-black text-[#2D2D2D] mb-4">Login to see favorites</h2>
              <p className="text-gray-400 max-w-sm mb-10 text-lg">
                Join us to start saving your favorite dishes!
              </p>
              <Link 
                href="/login" 
                className="h-16 px-12 rounded-full bg-[#EE4444] text-white font-bold flex items-center justify-center shadow-xl shadow-[#EE4444]/25 hover:scale-105 transition-all"
              >
                Sign In
              </Link>
            </div>
          ) : loading ? (
             <div className="py-20 flex justify-center">
               <div className="w-12 h-12 border-4 border-[#EE4444] border-t-transparent rounded-full animate-spin" />
             </div>
          ) : filteredFavorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {filteredFavorites.map((fav) => {
                const item = fav.food;
                if (!item) return null;
                return (
                  <div key={item._id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 relative">
                    <div className="relative h-56 overflow-hidden bg-[#F8F8F8]">
                      <img 
                        src={item.image} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        alt={item.name} 
                      />
                      <button 
                        onClick={() => removeFavorite(item._id)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white text-[#EE4444] flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-90"
                      >
                        <Heart className="w-5 h-5 fill-current" />
                      </button>
                    </div>

                    <div className="p-8">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-black text-[#2D2D2D] group-hover:text-[#EE4444] transition-colors truncate">{item.name}</h3>
                          <div className="flex items-center gap-2">
                             <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">{item.category?.name || item.category}</span>
                             {item.restaurant && <span className="text-gray-300 font-bold text-xs uppercase tracking-widest">• by {item.restaurant.name}</span>}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">{item.description}</p>

                      <div className="flex items-center justify-between mb-8">
                         <span className="text-2xl font-black text-[#2D2D2D]">Rs. {item.price}</span>
                         <button className="w-12 h-12 rounded-2xl bg-[#EE4444] text-white flex items-center justify-center shadow-lg shadow-[#EE4444]/25 hover:scale-110 active:scale-95 transition-all">
                           <Plus className="w-6 h-6 stroke-[3px]" />
                         </button>
                      </div>

                      {item.restaurant && (
                        <Link 
                          href={`/restaurant/${item.restaurant._id || item.restaurant}`}
                          className="w-full h-14 rounded-2xl border-2 border-gray-50 text-[#2D2D2D] font-black text-sm flex items-center justify-center gap-3 hover:bg-[#EE4444] hover:text-white hover:border-[#EE4444] transition-all group/btn"
                        >
                          Visit Restaurant
                          <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
              
              <div className="border-4 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center group hover:border-[#EE4444]/20 transition-all cursor-pointer" onClick={() => router.push('/menu')}>
                 <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-6 group-hover:bg-red-50 group-hover:text-[#EE4444] transition-all">
                    <UtensilsCrossed className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-bold text-gray-400 mb-2">Discover More</h3>
                 <p className="text-sm text-gray-300 font-medium mb-6">Explore new cuisines and add them here</p>
                 <button className="h-12 px-6 rounded-xl bg-gray-100 text-gray-600 font-bold text-xs group-hover:bg-[#EE4444] group-hover:text-white transition-all">Browse Menu</button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[3rem] py-32 flex flex-col items-center text-center shadow-sm border border-gray-100 mb-20">
              <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center text-[#EE4444] mb-8">
                <Heart className="w-10 h-10 fill-current" />
              </div>
              <h2 className="text-3xl font-black text-[#2D2D2D] mb-4">No favorites yet</h2>
              <p className="text-gray-400 max-w-sm mb-10 text-lg">
                Start exploring and tap the heart icon to save your favorite dishes!
              </p>
              <Link 
                href="/menu" 
                className="h-16 px-12 rounded-full bg-[#EE4444] text-white font-bold flex items-center justify-center shadow-xl shadow-[#EE4444]/25 hover:scale-105 transition-all"
              >
                Explore Menu
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
