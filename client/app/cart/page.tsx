"use client";

import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { 
  ChevronLeft, 
  Trash2, 
  Minus, 
  Plus, 
  Clock, 
  MapPin, 
  ChevronRight,
  Ticket
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Margherita Pizza",
      price: 12.99,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: 2,
      name: "Classic Cheeseburger",
      price: 9.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200"
    }
  ]);

  const updateQuantity = (id: number, delta: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="pt-24 pb-32">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#EE4444] transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-[#2D2D2D]">Your Cart</h1>
              <p className="text-gray-400 font-bold text-sm">{items.length} items</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Delivery Info */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 flex items-center gap-4 border-b border-gray-50">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">Delivery in 25-30 min</p>
                  <p className="text-xs text-gray-400 font-medium">Standard delivery</p>
                </div>
              </div>
              <div className="p-6 flex items-center justify-between hover:bg-gray-50/50 cursor-pointer transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#EE4444] flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Home</p>
                    <p className="text-xs text-gray-400 font-medium truncate max-w-[200px] md:max-w-none">
                      123 Main St, Apt 4B, New York
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Order Items</h2>
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-[2rem] p-4 md:p-6 border border-gray-100 shadow-sm flex items-center gap-4 md:gap-6 group">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-gray-50 shadow-inner shrink-0">
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-black text-[#2D2D2D] truncate group-hover:text-[#EE4444] transition-colors">{item.name}</h3>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[#EE4444] font-black">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-1 px-2">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-[#EE4444] transition-all shadow-sm active:scale-95"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-black text-gray-700 min-w-[20px] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-lg bg-[#EE4444] flex items-center justify-center text-white hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code */}
            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-[#EE4444]">
                <Ticket className="w-5 h-5" />
                <span className="text-sm font-black uppercase tracking-widest text-gray-700">Apply Coupon</span>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter coupon code"
                  className="flex-1 h-12 px-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all font-bold text-sm outline-none"
                />
                <button className="h-12 px-8 bg-gray-800 text-white rounded-xl font-black text-sm hover:scale-105 transition-all">Apply</button>
              </div>
            </div>

            {/* Bill Details */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-4">Bill Details</h2>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold">Item Total</span>
                <span className="text-gray-800 font-black">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold">Delivery Fee</span>
                <span className="text-gray-800 font-black">${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-xl">
                 <span className="text-gray-800 font-black">To Pay</span>
                 <span className="text-[#EE4444] font-black">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Persistent Proceed Button */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-gray-100 p-4 md:p-6 z-40">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => router.push("/checkout")}
            className="w-full h-16 bg-[#EE4444] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-2xl shadow-red-500/30 active:scale-[0.98]"
          >
            Proceed to Payment • ${total.toFixed(2)}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
