"use client";

import React from "react";
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
  Ticket,
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLocation } from "@/context/LocationContext";

export default function CartPage() {
  const router = useRouter();
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const { address } = useLocation();

  const subtotal = cart?.totalPrice || 0;
  const deliveryFee = subtotal > 0 ? 50 : 0; // Local currency logic (Rs.)
  const total = subtotal + deliveryFee;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#EE4444] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="pt-24 pb-32">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.back()}
                className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#EE4444] transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-black text-[#2D2D2D]">Your Cart</h1>
                <p className="text-gray-400 font-bold text-sm">{cart?.items.length || 0} items</p>
              </div>
            </div>
            
            {(cart?.items.length || 0) > 0 && (
              <button 
                onClick={() => { if(confirm("Clear entire cart?")) clearCart(); }}
                className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors"
              >
                Clear Cart
              </button>
            )}
          </div>

          {!cart || cart.items.length === 0 ? (
            <div className="py-20 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <h2 className="text-2xl font-black text-gray-800 mb-2">Your cart is empty</h2>
              <p className="text-gray-400 font-medium mb-8">Delicious food is just a few clicks away!</p>
              <Link href="/menu">
                <button className="h-14 px-8 bg-[#EE4444] text-white rounded-2xl font-black hover:scale-105 transition-all shadow-xl shadow-red-500/20 active:scale-95">
                  Browse Menu
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Delivery Info */}
              <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
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
                      <p className="font-bold text-gray-800">Delivering To</p>
                      <p className="text-xs text-gray-400 font-medium truncate max-w-[200px] md:max-w-none">
                        {address || "Set your location"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Order Items</h2>
                {cart.items.map((item) => (
                  <div key={item.food._id} className="bg-white rounded-4xl p-4 md:p-6 border border-gray-100 shadow-sm flex items-center gap-4 md:gap-6 group">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-gray-50 shadow-inner shrink-0">
                      <img 
                        src={item.food.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200"} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        alt={item.food.name} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-black text-[#2D2D2D] truncate group-hover:text-[#EE4444] transition-colors">{item.food.name}</h3>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">{item.restaurant?.name || "Restaurant"}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.food._id)}
                          className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[#EE4444] font-black">Rs. {item.food.price}</p>
                        <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-1 px-2">
                          <button 
                            onClick={() => updateQuantity(item.food._id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-[#EE4444] transition-all shadow-sm active:scale-95"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-black text-gray-700 min-w-[20px] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.food._id, item.quantity + 1)}
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
              <div className="bg-white rounded-4xl p-6 border border-gray-100 shadow-sm">
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
              <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-sm space-y-4">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-4">Bill Details</h2>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-bold">Item Total</span>
                  <span className="text-gray-800 font-black">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-bold">Delivery Fee</span>
                  <span className="text-gray-800 font-black">Rs. {deliveryFee}</span>
                </div>
                <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-xl">
                  <span className="text-gray-800 font-black">To Pay</span>
                  <span className="text-[#EE4444] font-black">Rs. {total}</span>
                </div>
              </div>

              {/* Space for persistent button */}
              <div className="h-20" />
            </div>
          )}
        </div>
      </main>

      {/* Persistent Proceed Button */}
      {cart && cart.items.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-gray-100 p-4 md:p-6 z-40">
          <div className="max-w-4xl mx-auto">
            <button 
              onClick={() => router.push("/checkout")}
              className="w-full h-16 bg-[#EE4444] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-2xl shadow-red-500/30 active:scale-[0.98]"
            >
              Proceed to Payment
              <ArrowRight className="w-5 h-5" />
              <span className="ml-2 pl-4 border-l border-white/20">Rs. {total}</span>
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
