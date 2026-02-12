"use client";

import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Users, Target, ShieldCheck, Heart, Award, Smartphone } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-4">
          
          {/* Hero Section */}
          <div className="text-center mb-20 py-10">
            <h1 className="text-4xl md:text-6xl font-black text-[#2D2D2D] mb-6">
              Our Mission is to <br />
              <span className="text-[#EE4444]">Fuel Your Cravings</span>
            </h1>
            <p className="text-gray-500 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Mr Fodee was founded with a simple idea: that everyone deserves easy access to the best flavors their city has to offer. We bridge the gap between top restaurants and food lovers.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
            {[
              { label: "Partner Restaurants", value: "2,000+" },
              { label: "Daily Deliveries", value: "15k+" },
              { label: "Active Users", value: "100k+" },
              { label: "Customer Rating", value: "4.9/5" },
            ].map((stat, i) => (
              <div key={i} className="bg-gray-50 rounded-3xl p-8 text-center border border-gray-100/50">
                <h3 className="text-3xl font-black text-[#EE4444] mb-2">{stat.value}</h3>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Values Section */}
          <div className="mb-24">
            <h2 className="text-3xl md:text-4xl font-black text-[#2D2D2D] text-center mb-16">
              Core Values That Drive Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: Target,
                  title: "Fast Reliability",
                  desc: "We prioritize your time. Our logistics network is optimized for speed without compromising on food quality."
                },
                {
                  icon: ShieldCheck,
                  title: "Quality First",
                  desc: "We only partner with restaurants that meet our high standards for hygiene, taste, and consistency."
                },
                {
                  icon: Heart,
                  title: "Customer Centric",
                  desc: "Your satisfaction is our north star. We're here to solve any issue and ensure you have a perfect meal every time."
                }
              ].map((value, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#EE4444] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#EE4444] group-hover:text-white transition-all duration-300">
                    <value.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-[#2D2D2D] mb-4">{value.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Story Section */}
          <div className="bg-[#2D2D2D] rounded-[3rem] p-10 md:p-20 flex flex-col md:flex-row items-center gap-12 mb-24">
            <div className="flex-1">
              <span className="text-[#EE4444] font-black uppercase tracking-widest text-sm mb-4 block">Our Story</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Started in a Small Kitchen, <br />
                Now Serving Your City.
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                What began as a small project to help local cafes reach more customers has grown into the city's most trusted food delivery infrastructure. We've spent years perfecting the tech to make sure your pizza arrives hot and your sushi arrives fresh.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="px-6 py-3 rounded-full bg-white/10 text-white font-bold border border-white/20">Est. 2024</div>
                <div className="px-6 py-3 rounded-full bg-white/10 text-white font-bold border border-white/20">Nepal-based</div>
                <div className="px-6 py-3 rounded-full bg-white/10 text-white font-bold border border-white/20">24/7 Support</div>
              </div>
            </div>
            <div className="md:w-1/2 rounded-[2rem] overflow-hidden rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1000" 
                alt="Tasty Pizza" 
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center py-20 bg-gray-50 rounded-[3rem]">
            <h2 className="text-3xl md:text-5xl font-black text-[#2D2D2D] mb-8">Ready to order?</h2>
            <p className="text-gray-500 text-lg mb-10">Join thousands of happy food lovers today.</p>
            <button className="h-16 px-12 rounded-full bg-[#EE4444] text-white font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#EE4444]/25">
              Explore Our Menu
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
