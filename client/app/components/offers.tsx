"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { offerApi } from "@/lib/api";
import { Percent, Tag, Calendar, Store, ChevronRight } from "lucide-react";

export default function OfferBanner() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data } = await offerApi.getAll();
        setOffers(data);
      } catch (err) {
        console.error("Failed to fetch offers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  if (loading)
    return (
      <div className="text-center py-12 text-gray-400 text-lg font-medium animate-pulse">
        Loading offers...
      </div>
    );

  if (offers.length === 0)
    return (
      <div className="text-center py-12 text-gray-400 text-lg font-medium">
        No active offers
      </div>
    );

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-6 my-12">
      {/* Header Section: Title and See More Button */}
      <div className="flex flex-row items-end justify-between mb-8 border-b border-gray-100 pb-6">
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-[900] text-gray-900 tracking-tight">
            Active Offers
          </h2>
          <p className="text-gray-500 text-base md:text-lg mt-2">
            Explore all the latest discounts and deals curated for you.
          </p>
        </div>

        <button
          onClick={() => router.push("/offers")}
          className="flex items-center gap-1 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors group whitespace-nowrap"
        >
          View all offers
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {offers.map((offer) => (
          <div
            key={offer._id}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          >
            {/* Gradient Accent Bar */}
            <div
              className="absolute top-0 left-0 w-full h-2"
              style={{
                background: `linear-gradient(to right, ${offer.gradientFrom || "#EE4444"}, ${
                  offer.gradientTo || "#FF8F73"
                })`,
              }}
            />

            {/* Status Badge */}
            <div className="flex items-start justify-between mb-4">
              <span
                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                  offer.isActive
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {offer.isActive ? "Active" : "Expired"}
              </span>
            </div>

            {/* Icon & Title Info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform duration-300">
                {offer.icon === "percent" ? (
                  <Percent className="w-7 h-7" />
                ) : (
                  <Tag className="w-7 h-7" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-gray-800 leading-tight">
                  {offer.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1 font-medium">
                  {offer.subtitle}
                </p>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between mb-4 border border-dashed border-gray-300">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                Code
              </span>
              <span className="font-mono font-black text-gray-800 text-xl tracking-[0.2em]">
                {offer.couponCode || "NO CODE"}
              </span>
            </div>

            {/* Footer Metadata */}
            <div className="flex items-center justify-between text-xs font-bold text-gray-400 pt-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(offer.endDate).toLocaleDateString()}
              </div>
              {offer.restaurant && (
                <div className="flex items-center gap-1.5 text-orange-500 bg-orange-50 px-2 py-1 rounded-md">
                  <Store className="w-3.5 h-3.5" />
                  {offer.restaurant.name}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
