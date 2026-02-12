"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { 
  Search, 
  Filter, 
  Star, 
  Plus, 
  ChevronRight, 
  Flame,
  Leaf,
  Heart
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { foodApi, favoritesApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

function MenuContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const { user } = useAuth();
  
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [foods, setFoods] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await foodApi.getAll();
        setFoods(res.data);

        if (user) {
          const favRes = await favoritesApi.getAllByUser(user.id);
          const ids = new Set<string>(favRes.data.map((f: any) => String(f.food?._id || f.food)));
          setFavoriteIds(ids);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const toggleFavorite = async (foodId: string) => {
    if (!user) {
      alert("Please login to add favorites");
      return;
    }

    try {
      const { data } = await favoritesApi.toggle({ user: user.id, food: foodId });
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (data.favorited) next.add(foodId);
        else next.delete(foodId);
        return next;
      });
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  };

  const categories = useMemo(() => {
    const base = ["All"];
    const uniqueCats = Array.from(new Set(foods.map(f => f.category?.name || f.category))).filter((c): c is string => !!c);
    return [...base, ...uniqueCats];
  }, [foods]);

  const filteredItems = foods.filter(item => {
    const catName = item.category?.name || item.category;
    const matchesCategory = activeCategory === "All" || catName === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-4">
      {/* Breadcrumbs & Back */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#EE4444] transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Our Menu</span>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-3">
            Our Delicious Menu
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            Discover our curated selection of premium dishes, prepared with fresh ingredients and a lot of love.
          </p>
        </div>
        
        {/* Search Box */}
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#EE4444] transition-colors" />
          <input 
            type="text" 
            placeholder="Search for dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white border border-gray-100 shadow-sm outline-none focus:ring-2 focus:ring-[#EE4444]/10 focus:border-[#EE4444] transition-all"
          />
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-10 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all shrink-0 ${
              activeCategory === cat
                ? "bg-[#EE4444] text-white shadow-lg shadow-[#EE4444]/25"
                : "bg-white text-gray-600 border border-gray-100 hover:border-gray-200 shadow-sm"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-80 bg-white rounded-[2.5rem] animate-pulse border border-gray-50" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div 
              key={item._id}
              className="group bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col"
            >
              <div className="relative aspect-square mb-6 rounded-[2rem] overflow-hidden bg-[#F8F8F8]">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {item.isBestSeller && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                      <Flame className="w-3 h-3 fill-current" />
                      Best Seller
                    </span>
                  )}
                  {item.isVeg && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                      <Leaf className="w-3 h-3 fill-current" />
                      Pure Veg
                    </span>
                  )}
                </div>

                <button 
                  onClick={() => toggleFavorite(item._id)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                >
                  <Heart className={`w-5 h-5 transition-colors ${favoriteIds.has(item._id) ? 'fill-[#EE4444] text-[#EE4444]' : 'text-gray-400'}`} />
                </button>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#EE4444] text-xs font-black uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">
                    {item.category?.name || item.category}
                  </span>
                  {item.restaurant && (
                    <span className="text-gray-400 text-xs font-bold">
                      by {item.restaurant.name}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-[#2D2D2D] mb-2 group-hover:text-[#EE4444] transition-colors line-clamp-1">
                  {item.name}
                </h3>
                
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-6">
                  {item.description}
                </p>

                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-400 font-medium block mb-0.5">Price</span>
                    <span className="text-3xl font-black text-[#2D2D2D]">
                      Rs. {item.price}
                    </span>
                  </div>

                  <button className="w-14 h-14 rounded-2xl bg-[#EE4444] text-white flex items-center justify-center shadow-lg shadow-[#EE4444]/25 hover:scale-105 active:scale-95 transition-all">
                    <Plus className="w-6 h-6 stroke-[3px]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredItems.length === 0 && (
        <div className="py-20 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-6">
            <Search className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-[#2D2D2D] mb-2">No items found</h3>
          <p className="text-gray-500">Try adjusting your filters or search keywords.</p>
          <button 
            onClick={() => {setActiveCategory("All"); setSearchQuery("");}}
            className="mt-6 font-bold text-[#EE4444] hover:underline"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <main className="pt-24 pb-20">
        <Suspense fallback={<div className="text-center py-20">Loading menu...</div>}>
          <MenuContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
