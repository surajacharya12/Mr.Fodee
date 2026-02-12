"use client";

import React from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { ChevronLeft, ChevronRight, Star, Clock, MapPin, Filter, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import RestaurantCard from "../../components/RestaurantCard";
import { restaurantApi } from "../../../lib/api";

const CATEGORY_DATA: Record<string, any> = {
  sushi: {
    title: "Best Sushi Near You",
    description: "Fresh sushi and Japanese cuisine",
    banner: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=2000",
    count: 12
  },
  pizza: {
    title: "Crispy Pizzas Nearby",
    description: "Authentic wood-fired and classic pizzas",
    banner: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=2000",
    count: 24
  },
  burgers: {
    title: "Juicy Burgers to Crave",
    description: "Gourmet burgers and classic fast food",
    banner: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=2000",
    count: 18
  }
};


export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params.slug as string) || "sushi";
  const [restaurants, setRestaurants] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const data = CATEGORY_DATA[slug.toLowerCase()] || CATEGORY_DATA.sushi;

  React.useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const res = await restaurantApi.getAll({ category: slug });
        setRestaurants(res.data);
      } catch (err) {
        console.error("Failed to fetch restaurants", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [slug]);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="pt-16">
        {/* Banner Section */}
        <div className="relative h-[300px] md:h-[400px] overflow-hidden">
          <div className="absolute inset-0">
            <img src={data.banner} className="w-full h-full object-cover" alt={data.title} />
            <div className="absolute inset-0 bg-linear-to-t from-white via-white/40 to-black/20" />
          </div>
          
          <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-16 mt-10">
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg mb-6 hover:scale-110 transition-transform"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-4xl md:text-6xl font-black text-[#2D2D2D] mb-4">
              {data.title}
            </h1>
            <p className="text-gray-700 font-medium text-lg md:text-xl">
              {data.description}
            </p>
          </div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-4 md:px-4 -mt-8 relative z-10 pb-20">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 bg-white/80 backdrop-blur-md p-3 rounded-xl border border-white">
            <Link href="/" className="hover:text-[#EE4444]">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-bold capitalize">{slug}</span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-10 scrollbar-hide">
            <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm font-bold text-gray-700 hover:border-[#EE4444]/30 transition-all shrink-0">
              <ArrowUpDown className="w-4 h-4" />
              Sort
              <Star className="w-3 h-3 text-gray-400 rotate-180" />
            </button>
            {["Rating 4.0+", "Pure Veg", "Fast Delivery", "Offers", "Near Me"].map((filter) => (
              <button 
                key={filter}
                className="px-6 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm font-bold text-gray-700 hover:border-[#EE4444]/30 transition-all shrink-0"
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-[#EE4444] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : restaurants.length > 0 ? (
              restaurants.map((restaurant) => {
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
              })
            ) : (
              <div className="col-span-full py-20 text-center">
                <h3 className="text-xl font-bold text-gray-400">No restaurants found in this category</h3>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
