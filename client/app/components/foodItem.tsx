"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { foodApi, categoryApi } from "@/lib/api";

export default function FoodCategories() {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, foodRes] = await Promise.all([
          categoryApi.getAll(),
          foodApi.getAll()
        ]);
        
        const catData = catRes.data.map((cat: any) => ({
          name: cat.name,
          image: cat.image,
          places: `${foodRes.data.filter((f: any) => (f.category?._id || f.category) === cat._id).length} dishes`
        }));
        
        setCategories(catData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="max-w-screen-2xl mx-auto px-4 md:px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D2D2D] mb-1">
            What's on your mind?
          </h2>
          <p className="text-gray-500 text-sm">
            Explore cuisines that match your cravings
          </p>
        </div>
        <Link href="/menu" className="flex items-center gap-1 text-sm font-bold text-[#EE4444] hover:opacity-80 transition-opacity">
          See all <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex items-center gap-6 overflow-x-auto pb-6 scrollbar-hide">
        {loading ? (
           <div className="flex gap-6">
             {[1,2,3,4,5,6].map((n) => (
                <div key={n} className="w-28 h-28 rounded-full bg-gray-100 animate-pulse" />
             ))}
           </div>
        ) : categories.map((category, index) => (
          <Link
            href={`/menu?category=${category.name}`}
            key={index}
            className="flex flex-col items-center gap-3 min-w-[120px] group cursor-pointer"
          >
            <div className={`relative w-28 h-28 rounded-full transition-all duration-300 group-hover:scale-105 hover:shadow-xl shadow-sm`}>
              <div className="w-full h-full rounded-full overflow-hidden bg-[#F8F8F8] p-0">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="text-center">
              <h3 className="font-bold text-[#2D2D2D] text-sm group-hover:text-[#EE4444] transition-colors">
                {category.name}
              </h3>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                {category.places}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
