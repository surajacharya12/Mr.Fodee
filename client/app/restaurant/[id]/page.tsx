"use client";

import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { 
  ChevronLeft, 
  Star, 
  Clock, 
  MapPin, 
  Heart, 
  Share2, 
  Plus, 
  Flame,
  Info,
  Search
} from "lucide-react";
import { useLocation } from "@/context/LocationContext";
import { useAuth } from "@/context/AuthContext";
import { calculateDistance, extractCoordsFromLink, formatDistance, getNavigationLink } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { restaurantApi, foodApi, favoritesApi, reviewApi } from "../../../lib/api";
import { MessageSquare, Send, X } from "lucide-react";

export default function RestaurantDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user } = useAuth();
  const { coords: userCoords, isLoading: isLocLoading } = useLocation();

  const [activeTab, setActiveTab] = useState("Recommended");
  const [restaurant, setRestaurant] = useState<any>(null);
  const [foods, setFoods] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [restRes, foodRes, reviewRes] = await Promise.all([
          restaurantApi.getById(id),
          foodApi.getAll({ restaurant: id }),
          reviewApi.getForRestaurant(id)
        ]);
        setRestaurant(restRes.data);
        setFoods(foodRes.data);
        setReviews(reviewRes.data);

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

    if (id) fetchData();
  }, [id, user]);

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

  const filteredFoods = useMemo(() => {
    let result = foods;
    if (activeTab === "Recommended") {
      result = foods.filter(f => f.isBestSeller);
      if (result.length === 0) result = foods;
    } else {
      result = foods.filter(f => (f.category?.name || f.category) === activeTab);
    }

    if (searchQuery) {
      result = result.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [foods, activeTab, searchQuery]);

  const categories = useMemo(() => {
    const base = ["Recommended"];
    const cats = Array.from(new Set(foods.map(f => f.category?.name || f.category))).filter(Boolean) as string[];
    return [...base, ...cats];
  }, [foods]);

  const { restaurantCoords, displayDistance } = useMemo(() => {
    if (!restaurant) return { restaurantCoords: null, displayDistance: null };
    if (isLocLoading) return { restaurantCoords: null, displayDistance: "Calculating..." };

    let rCoords = null;

    if (restaurant.location?.coordinates && (restaurant.location.coordinates[0] !== 0 || restaurant.location.coordinates[1] !== 0)) {
      rCoords = {
        latitude: restaurant.location.coordinates[1],
        longitude: restaurant.location.coordinates[0],
      };
    } else if (restaurant.googleMapsLink) {
      rCoords = extractCoordsFromLink(restaurant.googleMapsLink);
    }

    let distStr = null;
    if (userCoords && rCoords) {
      const dist = calculateDistance(
        userCoords.latitude,
        userCoords.longitude,
        rCoords.latitude,
        rCoords.longitude
      );
      distStr = formatDistance(dist);
    }

    return { restaurantCoords: rCoords, displayDistance: distStr };
  }, [userCoords, restaurant, isLocLoading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#EE4444] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Cooking up your menu...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <Navbar />
        <div className="pt-40 text-center">
          <h1 className="text-2xl font-bold text-gray-500">Restaurant not found</h1>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 text-[#EE4444] font-bold"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="pt-20">
        {/* Cover Image & Actions */}
        <div className="relative h-[250px] md:h-[350px]">
          <img 
            src={restaurant.restaurantImage || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=2000"} 
            className="w-full h-full object-cover" 
            alt={restaurant.name} 
          />
          <div className="absolute inset-0 bg-black/20" />
          
          <div className="absolute top-6 left-4 md:left-16 flex items-center justify-between w-[calc(100%-2rem)] md:w-[calc(100%-8rem)]">
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex gap-4">
              <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Heart className="w-5 h-5 text-gray-700" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Share2 className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Restaurant Info Card */}
        <div className="max-w-screen-2xl mx-auto px-4 md:px-4">
          <div className="relative -mt-20 md:-mt-24 mb-10">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-gray-200/50 border border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-black text-[#2D2D2D]">{restaurant.name}</h1>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500 text-white text-sm font-black">
                    <Star className="w-4 h-4 fill-current" />
                    {restaurant.rating}
                  </div>
                </div>
                <p className="text-gray-500 font-medium mb-6">{restaurant.foodCategory} • {restaurant.cuisines || 'Multi Cuisine'}</p>
                
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 font-bold">
                    <Clock className="w-5 h-5 text-primary" />
                    {restaurant.deliveryTime}
                  </div>
                  
                  {(restaurant.location?.address || displayDistance) && (
                    <div className="flex items-center gap-2 text-gray-600 font-bold">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span>
                        {restaurant.location?.address}
                        {restaurant.location?.address && displayDistance && " • "}
                        {displayDistance}
                      </span>
                    </div>
                  )}

                  {restaurant.offer && (
                    <div className="px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 font-black uppercase text-[10px] tracking-widest border border-orange-100">
                      {restaurant.offer}
                    </div>
                  )}

                  {restaurantCoords && (
                    <a 
                      href={getNavigationLink(restaurantCoords.latitude, restaurantCoords.longitude)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs transition-colors border border-gray-100"
                    >
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      Open Map
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            {/* Search within menu */}
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#EE4444]" />
              <input 
                type="text" 
                placeholder="Search in this menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-xl bg-gray-100/50 border border-transparent outline-none focus:bg-white focus:border-[#EE4444]/20 focus:ring-4 focus:ring-[#EE4444]/5 transition-all text-sm"
              />
            </div>
          </div>

          {/* Menu Categories Tabs */}
          <div className="sticky top-20 z-20 bg-[#FAFAFA] flex items-center gap-3 overflow-x-auto pb-4 mb-10 scrollbar-hide border-b border-gray-100/50 pt-2">
            {categories.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all shrink-0 ${
                  activeTab === tab
                    ? "bg-[#EE4444] text-white shadow-lg shadow-[#EE4444]/25"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Menu Items List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            {filteredFoods.length === 0 ? (
              <div className="lg:col-span-2 text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No items found</p>
              </div>
            ) : (
              filteredFoods.map((item) => (
                <div 
                  key={item._id}
                  className="group bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 flex items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-6 flex-1 min-w-0">
                    <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-[2rem] bg-[#F8F8F8] overflow-hidden shrink-0">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                      <button 
                        onClick={() => toggleFavorite(item._id)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                      >
                        <Heart 
                          className={`w-4 h-4 transition-colors ${favoriteIds.has(item._id) ? 'fill-[#EE4444] text-[#EE4444]' : 'text-gray-400'}`} 
                        />
                      </button>
                      {item.isBestSeller && (
                        <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-orange-500 text-white text-[8px] font-black uppercase tracking-widest shadow-lg">
                          Bestseller
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center shrink-0 ${item.isVeg ? 'border-emerald-500' : 'border-red-500'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.category?.name || item.category}</span>
                      </div>

                      <h3 className="text-lg md:text-xl font-bold text-[#2D2D2D] mb-1 group-hover:text-[#EE4444] transition-colors truncate">{item.name}</h3>
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-4">{item.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-[#2D2D2D]">Rs. {item.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <button className="h-11 px-7 rounded-xl bg-white text-[#EE4444] font-black border-2 border-gray-100 hover:border-[#EE4444] hover:bg-[#EE4444] hover:text-white transition-all shadow-sm text-sm">
                      ADD
                    </button>
                    <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Customizable</p>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
