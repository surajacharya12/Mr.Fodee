"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Star, Clock, Heart, TrendingUp, MapPin } from "lucide-react";
import { useLocation } from "@/context/LocationContext";
import { calculateDistance, extractCoordsFromLink, formatDistance } from "@/lib/utils";

interface RestaurantCardProps {
  id?: string | number;
  _id?: string;
  name: string;
  image?: string;
  restaurantImage?: string;
  rating: number;
  deliveryTime: string;
  cuisine: string;
  priceRange: string;
  offer?: string;
  promoted?: boolean;
  googleMapsLink?: string;
  location?: {
    coordinates: [number, number];
    address?: string;
  };
}

const RestaurantCard = ({
  name,
  image,
  restaurantImage,
  rating,
  deliveryTime,
  cuisine,
  priceRange,
  offer,
  promoted,
  googleMapsLink,
  location,
}: RestaurantCardProps) => {
  const [liked, setLiked] = useState(false);
  const { coords: userCoords, isLoading: isLocLoading } = useLocation();

  const displayDistance = useMemo(() => {
    if (isLocLoading) return "Calculating...";
    
    let restaurantCoords = null;

    // 1. Try to get from location.coordinates if not [0,0]
    if (location?.coordinates && (location.coordinates[0] !== 0 || location.coordinates[1] !== 0)) {
      restaurantCoords = {
        latitude: location.coordinates[1],
        longitude: location.coordinates[0],
      };
    } 
    // 2. Try to extract from googleMapsLink
    else if (googleMapsLink) {
      restaurantCoords = extractCoordsFromLink(googleMapsLink);
    }

    if (userCoords && restaurantCoords) {
      const dist = calculateDistance(
        userCoords.latitude,
        userCoords.longitude,
        restaurantCoords.latitude,
        restaurantCoords.longitude
      );
      return formatDistance(dist);
    }

    return null; // No display if we can't calculate
  }, [userCoords, location, googleMapsLink, isLocLoading]);

  const displayImage =
    image ||
    restaurantImage ||
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000";

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100">
      <div className="relative h-44 overflow-hidden">
        <Image
          src={displayImage}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 p-3 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            {promoted && (
              <span className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter bg-black/60 text-white">
                <TrendingUp className="w-2.5 h-2.5" />
                Promoted
              </span>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setLiked(!liked);
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all bg-white shadow-sm"
            >
              <Heart
                className={`w-4 h-4 transition-all ${
                  liked
                    ? "fill-red-500 text-red-500 scale-110"
                    : "text-gray-400"
                }`}
              />
            </button>
          </div>

          {offer && (
            <div className="absolute bottom-0 left-0 right-0 bg-[#EE4444] px-3 py-1.5">
              <p className="text-[10px] font-bold text-white uppercase tracking-wider">
                {offer}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-[#2D2D2D] text-base truncate group-hover:text-[#EE4444] transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#4CAF50] text-white">
            <span className="text-[11px] font-bold">{rating}</span>
            <Star className="w-2.5 h-2.5 fill-current" />
          </div>
        </div>

        <p className="text-[12px] text-gray-500 truncate mb-3">{cuisine}</p>

        <div className="flex items-center gap-4 text-[12px] text-gray-400 font-medium whitespace-nowrap overflow-hidden">
          <div className="flex items-center gap-1 shrink-0">
            <Clock className="w-3.5 h-3.5" />
            <span>{deliveryTime}</span>
          </div>
          {(displayDistance || location?.address) && (
            <div className="flex items-center gap-1 shrink-0 max-w-[120px]">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate">{displayDistance || location?.address}</span>
            </div>
          )}
          <div className="flex items-center gap-1 shrink-0">
            <span>•</span>
            <span>{priceRange}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
