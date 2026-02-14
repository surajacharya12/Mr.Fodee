"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { 
  ChevronLeft, 
  MapPin, 
  Plus, 
  Clock, 
  CreditCard, 
  Banknote, 
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  X,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLocation } from "@/context/LocationContext";
import { orderApi } from "@/lib/api";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const { cart, clearCart } = useCart();
  const { address: currentAddress, coords } = useLocation();
  
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("current");
  const [customAddress, setCustomAddress] = useState("");
  const [payment, setPayment] = useState("cod");
  const [instructions, setInstructions] = useState("");

  const subtotal = cart?.totalPrice || 0;
  const deliveryFee = subtotal > 0 ? 50 : 0;
  const total = subtotal + deliveryFee;

  // Sync custom/selected address details
  const getDisplayAddress = () => {
    if (selectedAddress === "current") {
      if (coords) {
        return `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
      }
      return currentAddress;
    }
    const addr = user?.addresses?.find((a: { type: string; detail: string }) => a.type.toLowerCase() === selectedAddress);
    return addr?.detail || "";
  };

  const handlePlaceOrder = async () => {
    if (!isLoggedIn || !user?.id) {
      toast.error("Please login to place an order");
      return;
    }

    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const finalAddress = getDisplayAddress();
    if (!finalAddress) {
      toast.error("Please select or provide a delivery address");
      return;
    }

    setLoading(true);
    try {
      if (payment === "cod") {
        await orderApi.placeCOD({
          userId: user.id,
          items: cart.items.map(item => ({
            food: item.food._id,
            quantity: item.quantity,
            price: item.food.price
          })),
          totalAmount: total,
          deliveryAddress: finalAddress,
          instructions: instructions
        });
        
        await clearCart();
        setSuccess(true);
      } else {
        toast.error("Only Cash on Delivery is currently supported");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!cart) return null;

  return (
    <div className={`min-h-screen bg-[#FAFAFA] ${success ? "overflow-hidden h-screen" : ""}`}>
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
            <h1 className="text-3xl font-black text-[#2D2D2D]">Checkout</h1>
          </div>

          <div className="space-y-8">
            {/* Delivery Address */}
            <section>
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  Delivery Address
                </h2>
              </div>
              <div className="space-y-3">
                {/* Current Location Option (Default) */}
                <AddressOption 
                  id="current" 
                  label="Current Location" 
                  detail={currentAddress || "Detecting your location..."} 
                  active={selectedAddress === "current"} 
                  onSelect={() => setSelectedAddress("current")}
                  isDefault 
                />

                {/* User Saved Addresses (Home/Work) */}
                {user?.addresses?.map((addr: any) => (
                  <AddressOption 
                    key={addr._id}
                    id={addr.type.toLowerCase()} 
                    label={addr.type} 
                    detail={addr.detail} 
                    active={selectedAddress === addr.type.toLowerCase()} 
                    onSelect={() => setSelectedAddress(addr.type.toLowerCase())}
                  />
                ))}

                {!user?.addresses?.length && (
                  <div className="p-6 bg-red-50/50 border-2 border-dashed border-red-100 rounded-4xl text-center">
                    <p className="text-xs font-bold text-gray-500">No saved addresses. You can add them in your profile.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Delivery Time */}
            <section>
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 px-2 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                Delivery Time
              </h2>
              <div className="bg-white rounded-4xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Standard Delivery</p>
                    <p className="text-sm text-gray-400 font-bold">Arrives in 25-30 min</p>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Active</span>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 px-2 flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5" />
                Payment Method
              </h2>
              <div className="space-y-3">
                <PaymentOption 
                  id="cod" 
                  label="Cash on Delivery" 
                  icon={<Banknote className="w-5 h-5" />} 
                  detail="Pay when you receive your food" 
                  active={payment === "cod"} 
                  onSelect={() => setPayment("cod")}
                />
                <PaymentOption 
                  id="card" 
                  label="Credit/Debit Card" 
                  icon={<CreditCard className="w-5 h-5" />} 
                  detail="Unavailable for this order" 
                  active={payment === "card"} 
                  onSelect={() => {}}
                  disabled
                />
              </div>
            </section>

            {/* Delivery Instructions */}
            <section>
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 px-2">Delivery Instructions</h2>
              <textarea 
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="E.g., Leave at door, ring bell twice..." 
                className="w-full h-32 p-6 rounded-4xl bg-white border border-gray-100 focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all font-bold text-gray-700 outline-none resize-none shadow-sm"
              />
            </section>

            {/* Order Summary */}
            <section className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h2 className="text-lg font-black text-[#2D2D2D]">Order Summary</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-bold">Subtotal ({cart.items.length} items)</span>
                  <span className="text-gray-800 font-black">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-bold">Delivery Fee</span>
                  <span className="text-gray-800 font-black">Rs. {deliveryFee}</span>
                </div>
                <div className="pt-6 mt-2 border-t border-gray-50 flex justify-between items-center">
                   <div className="flex flex-col">
                     <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Grand Total</span>
                     <span className="text-3xl font-black text-[#EE4444]">Rs. {total}</span>
                   </div>
                   <button 
                     onClick={handlePlaceOrder}
                     disabled={loading}
                     className="h-16 px-12 bg-[#EE4444] text-white rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-red-500/30 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                   >
                     {loading ? (
                       <Loader2 className="w-5 h-5 animate-spin" />
                     ) : (
                       "Place Order"
                     )}
                   </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Success Modal Overlay */}
      {success && (
        <div className="fixed inset-0 z-100 flex items-center justify-center -mt-20">
          <div 
            className="absolute inset-0 bg-[#2D2D2D]/80 backdrop-blur-md animate-in fade-in duration-500" 
            onClick={() => setSuccess(false)}
          />
          <div className="relative bg-white rounded-[3rem] w-[90%] max-w-lg p-10 md:p-14 text-center shadow-2xl animate-in zoom-in-95 duration-300">
             <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-500 mx-auto mb-8 shadow-xl shadow-emerald-500/10">
                <CheckCircle2 className="w-12 h-12" />
             </div>
             
             <h2 className="text-4xl font-black text-[#2D2D2D] mb-4">Order Placed!</h2>
             <p className="text-gray-400 font-bold text-lg mb-10 leading-relaxed px-4">
               Your order will arrive in <span className="text-[#EE4444]">25-30 minutes</span>. Get ready!
             </p>
             
             <div className="flex flex-col gap-4">
                <button 
                  onClick={() => router.push("/orders")}
                  className="h-16 rounded-2xl bg-gray-50 text-gray-800 font-black text-lg hover:bg-gray-100 transition-all border border-gray-100"
                >
                  Track Order
                </button>
                <button 
                  onClick={() => router.push("/")}
                  className="h-16 rounded-2xl bg-[#EE4444] text-white font-black text-lg hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 active:scale-[0.98]"
                >
                  Back Home
                </button>
             </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function AddressOption({ label, detail, active, onSelect, isDefault = false }: any) {
  return (
    <div 
      onClick={onSelect}
      className={`p-6 bg-white border-2 rounded-4xl cursor-pointer transition-all flex items-start gap-4 hover:shadow-lg ${
        active ? "border-[#EE4444] shadow-red-100/30" : "border-gray-100"
      }`}
    >
      <div className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
        active ? "border-[#EE4444]" : "border-gray-300"
      }`}>
        {active && <div className="w-2 h-2 rounded-full bg-[#EE4444]" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-black text-gray-800">{label}</span>
          {isDefault && (
            <span className="text-[9px] font-black uppercase tracking-widest text-[#EE4444] bg-red-50 px-2 py-0.5 rounded-full">Default</span>
          )}
        </div>
        <p className="text-xs text-gray-400 font-medium leading-relaxed truncate">{detail}</p>
      </div>
    </div>
  );
}

function PaymentOption({ label, icon, detail, active, onSelect, disabled = false }: any) {
  return (
    <div 
      onClick={() => !disabled && onSelect()}
      className={`p-6 bg-white border-2 rounded-4xl transition-all flex items-center justify-between group ${
        disabled ? "opacity-50 grayscale cursor-not-allowed" : "cursor-pointer hover:shadow-lg"
      } ${
        active ? "border-[#EE4444] shadow-red-100/30" : "border-gray-100"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          active ? "border-[#EE4444]" : "border-gray-300"
        }`}>
          {active && <div className="w-2 h-2 rounded-full bg-[#EE4444]" />}
        </div>
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            active ? "bg-red-50 text-[#EE4444]" : "bg-gray-50 text-gray-400"
          }`}>
            {icon}
          </div>
          <div>
            <p className="font-black text-gray-800 text-sm">{label}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{detail}</p>
          </div>
        </div>
      </div>
      {!disabled && <ChevronRight className={`w-4 h-4 transition-colors ${active ? "text-[#EE4444]" : "text-gray-300"}`} />}
    </div>
  );
}
