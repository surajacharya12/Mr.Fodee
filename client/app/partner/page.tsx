"use client";

import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Store, TrendingUp, BarChart3, Users, CheckCircle2, ArrowRight } from "lucide-react";

export default function PartnerPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Partner Hero */}
        <div className="max-w-screen-2xl mx-auto px-4 md:px-4 py-20 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h1 className="text-4xl md:text-6xl font-black text-[#2D2D2D] leading-tight">
              Grow Your Business <br />
              With <span className="text-[#EE4444]">Mr Fodee</span>
            </h1>
            <p className="text-gray-500 text-lg md:text-xl leading-relaxed">
              Reach more customers, increase your revenue, and manage your restaurant efficiently with our world-class delivery network.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="h-16 px-10 rounded-full bg-[#EE4444] text-white font-bold flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#EE4444]/25">
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="h-16 px-10 rounded-full bg-white text-[#2D2D2D] font-bold border border-gray-200 hover:bg-gray-50 transition-all">
                Learn More
              </button>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-orange-100 rounded-full blur-[100px] opacity-50" />
            <img 
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1000" 
              className="relative z-10 w-full rounded-[3rem] shadow-2xl rotate-2"
              alt="Restaurant Partner"
            />
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gray-50 py-24">
          <div className="max-w-screen-2xl mx-auto px-4 md:px-4">
            <h2 className="text-3xl md:text-4xl font-black text-[#2D2D2D] text-center mb-16">Why partner with us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: TrendingUp,
                  title: "Increase Revenue",
                  desc: "Access our massive customer base and see your orders grow exponentially from day one."
                },
                {
                  icon: BarChart3,
                  title: "Smart Analytics",
                  desc: "Get deep insights into your sales, customer preferences, and optimize your menu for growth."
                },
                {
                  icon: Users,
                  title: "Reliable Logistics",
                  desc: "Leverage our fleet of thousands of riders to ensure your food reaches customers fresh and on time."
                }
              ].map((item, i) => (
                <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#EE4444] flex items-center justify-center mb-6">
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[#2D2D2D] mb-4">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="max-w-screen-2xl mx-auto px-4 md:px-4 py-24 text-center">
          <h2 className="text-3xl font-black text-[#2D2D2D] mb-12">How it works</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0">
            {[
              { step: "1", title: "Apply", desc: "Submit your details" },
              { step: "2", title: "Verify", desc: "Our team inspections" },
              { step: "3", title: "Onboard", desc: "Training & Equipment" },
              { step: "4", title: "Serve", desc: "Start receiving orders" }
            ].map((step, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center w-64">
                  <div className="w-16 h-16 rounded-full bg-[#2D2D2D] text-white flex items-center justify-center font-black text-xl mb-6 ring-8 ring-gray-100">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm whitespace-nowrap">{step.desc}</p>
                </div>
                {i < 3 && <div className="hidden md:block w-32 h-0.5 bg-gray-200 mx-4" />}
              </React.Fragment>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
