"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, Flame, Sparkles, Clock, Star } from "lucide-react";
import RestaurantCard from "./RestaurantCard";
import { restaurantApi } from "@/lib/api";

const filters = [
  { label: "Popular", icon: Flame },
  { label: "New", icon: Sparkles },
  { label: "Fast Delivery", icon: Clock },
  { label: "Top Rated", icon: Star },
];

interface RestaurantSectionProps {
  limit?: number;
  showViewAll?: boolean;
}

const RestaurantSection = ({ limit, showViewAll = true }: RestaurantSectionProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeFilter, setActiveFilter] = useState("Popular");
  const [restaurants, setRestaurants] = useState<any[]>([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await restaurantApi.getAll();
        setRestaurants(res.data);
      } catch (err) {
        console.error("Failed to fetch restaurants", err);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter((r) => {
    if (activeFilter === "Popular") return r.rating >= 4.5;
    if (activeFilter === "New") return r.isNew;
    if (activeFilter === "Fast Delivery") return parseInt(r.deliveryTime) <= 30;
    if (activeFilter === "Top Rated") return r.rating >= 4.7;
    return true;
  });

  // Apply limit if provided (e.g. 20 for 5 rows)
  const displayRestaurants = limit ? filteredRestaurants.slice(0, limit) : filteredRestaurants;

  // Auto-hide View All button if we're already on the /restaurants page
  const shouldShowButton = showViewAll && pathname !== "/restaurants";

  return (
    <section className="max-w-screen-2xl mx-auto px-4 md:px-4 py-10 pb-28">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D2D2D] mb-1">
            Popular Restaurants
          </h2>
          <p className="text-gray-500 text-sm">
            Top picks based on ratings and orders
          </p>
        </div>

        {shouldShowButton && (
          <button
            onClick={() => router.push("/restaurants")}
            className="group flex items-center gap-1 text-sm font-semibold text-[#EE4444] hover:opacity-80 transition-all"
          >
            View all restaurants
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Filter Pills */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter.label}
            onClick={() => setActiveFilter(filter.label)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 shrink-0 ${
              activeFilter === filter.label
                ? "bg-[#EE4444] text-white shadow-[0_4px_12px_rgba(238,68,68,0.25)]"
                : "bg-white text-gray-700 border border-gray-100 hover:border-gray-200 shadow-sm"
            }`}
          >
            <filter.icon
              className={`w-4 h-4 ${activeFilter === filter.label ? "text-white" : "text-gray-400"}`}
            />
            {filter.label}
          </button>
        ))}
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
        {displayRestaurants.map((restaurant) => {
          const restaurantId = restaurant._id || restaurant.id;
          return (
            <div
              key={restaurantId}
              onClick={() => router.push(`/restaurant/${restaurantId}`)}
              className="cursor-pointer"
            >
              <RestaurantCard {...restaurant} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RestaurantSection;
