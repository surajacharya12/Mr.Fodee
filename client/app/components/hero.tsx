"use client";

import React from "react";
import { ArrowRight, Car, Sparkles, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import FoodItem from "./foodItem";
import OfferBanner from "./offers";
import RestaurantSection from "./restaurants";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden mx-4 mt-11 md:mx-0">
      {/* Background with parallax effect */}
      <div className="relative h-[530px] md:h-[580px] rounded-3xl md:rounded-none overflow-hidden">
        {/* Background Image with Zoom Effect */}
        <div className="absolute inset-0 scale-105">
          <img
            src="/assets/hero-food.jpg"
            alt="Delicious food spread"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Multi-layered Overlays for depth */}
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        {/* Glow Blobs (Design System Updates) */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-400/10 rounded-full blur-[100px]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-16">
          <div className="max-w-2xl">
            {/* Promo Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-linear-to-r from-orange-500 to-orange-400">
                <Car className="w-3.5 h-3.5 text-white" />
              </span>
              <span className="text-sm font-medium text-white/90">
                Free delivery on first order
              </span>
            </div>

            {/* Main Heading */}
            <h1
              className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6 animate-fade-up tracking-tight"
              style={{ animationDelay: "0.2s" }}
            >
              Delicious Food,
              <br />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-orange-400 to-orange-200">
                Delivered Fast
              </span>
            </h1>

            {/* Subtext */}
            <p
              className="text-white/70 text-lg md:text-xl mb-10 max-w-md leading-relaxed animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              Order from 2,000+ restaurants near you with lightning-fast
              delivery
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap items-center gap-4 animate-fade-up"
              style={{ animationDelay: "0.45s" }}
            >
              <button
                onClick={() => router.push("/menu")}
                className="group h-14 px-10 rounded-full bg-linear-to-r from-orange-600 to-orange-400 text-white font-bold text-base shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                Order Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => router.push("/restaurants")}
                className="h-14 px-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-base hover:bg-white/20 transition-all duration-300"
              >
                Explore Restaurants
              </button>
            </div>

            {/* Stats Section */}
            <div
              className="flex items-center gap-10 mt-14 animate-fade-up"
              style={{ animationDelay: "0.5s" }}
            >
              <div>
                <p className="text-3xl font-bold text-white">2K+</p>
                <p className="text-sm text-white/50 font-medium uppercase tracking-wider">
                  Restaurants
                </p>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div>
                <p className="text-3xl font-bold text-white">15min</p>
                <p className="text-sm text-white/50 font-medium uppercase tracking-wider">
                  Avg. Delivery
                </p>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div>
                <p className="text-3xl font-bold text-white">4.9★</p>
                <p className="text-sm text-white/50 font-medium uppercase tracking-wider">
                  App Rating
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Decorative Elements (Glassmorphism + Emojis) */}
        <div
          className="absolute bottom-12 right-12 animate-bounce hidden md:block"
          style={{ animationDuration: "4s" }}
        >
          <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center rotate-12 shadow-2xl">
            <span className="text-5xl">🍔</span>
          </div>
        </div>

        <div
          className="absolute top-24 right-1/4 animate-bounce hidden lg:block"
          style={{ animationDelay: "1s", animationDuration: "5s" }}
        >
          <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center -rotate-12 shadow-2xl">
            <span className="text-4xl">🍕</span>
          </div>
        </div>
      </div>
      <div>
        <FoodItem />
        <OfferBanner />
        <RestaurantSection limit={20} />
      </div>
    </section>
  );
}
