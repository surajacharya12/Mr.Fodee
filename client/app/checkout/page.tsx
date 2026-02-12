"use client";

import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { 
  ChevronLeft, 
  MapPin, 
  Plus, 
  Clock, 
  CreditCard, 
  Wallet, 
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [address, setAddress] = useState("home");
  const [payment, setPayment] = useState("card");

  const subtotal = 32.98;
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;

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
                <button className="text-[10px] font-black text-[#EE4444] uppercase tracking-widest flex items-center gap-1.5 hover:opacity-70 transition-opacity">
                   <Plus className="w-3.5 h-3.5" />
                   Add New
                </button>
              </div>
              <div className="space-y-3">
                <AddressOption 
                  id="home" 
                  label="Home" 
                  detail="123 Main St, Apt 4B, New York, NY 10001" 
                  active={address === "home"} 
                  onSelect={() => setAddress("home")}
                  isDefault 
                />
                <AddressOption 
                  id="work" 
                  label="Work" 
                  detail="456 Office Park, Floor 5, New York, NY 10002" 
                  active={address === "work"} 
                  onSelect={() => setAddress("work")}
                />
              </div>
            </section>

            {/* Delivery Time */}
            <section>
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 px-2 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                Delivery Time
              </h2>
              <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex items-center justify-between hover:bg-gray-50/50 cursor-pointer transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Standard Delivery</p>
                    <p className="text-sm text-gray-400 font-bold">Arrives in 25-30 min</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
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
                  id="card" 
                  label="Credit/Debit Card" 
                  icon={<CreditCard className="w-5 h-5" />} 
                  detail="Visa **** 4242" 
                  active={payment === "card"} 
                  onSelect={() => setPayment("card")}
                />
                <PaymentOption 
                  id="wallet" 
                  label="Mr. Fodee Wallet" 
                  icon={<Wallet className="w-5 h-5" />} 
                  detail="Balance $25.00" 
                  active={payment === "wallet"} 
                  onSelect={() => setPayment("wallet")}
                />
              </div>
            </section>

            {/* Delivery Instructions */}
            <section>
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 px-2">Delivery Instructions</h2>
              <textarea 
                placeholder="E.g., Leave at door, ring bell twice..." 
                className="w-full h-32 p-6 rounded-[2rem] bg-white border border-gray-100 focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all font-bold text-gray-700 outline-none resize-none shadow-sm"
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
                  <span className="text-gray-400 font-bold">Subtotal (3 items)</span>
                  <span className="text-gray-800 font-black">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-bold">Delivery Fee</span>
                  <span className="text-gray-800 font-black">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="pt-6 mt-2 border-t border-gray-50 flex justify-between items-center">
                   <div className="flex flex-col">
                     <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Grand Total</span>
                     <span className="text-3xl font-black text-[#EE4444]">${total.toFixed(2)}</span>
                   </div>
                   <button 
                     onClick={() => setSuccess(true)}
                     className="h-16 px-12 bg-[#EE4444] text-white rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-red-500/30 active:scale-[0.98]"
                   >
                     Place Order
                   </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Success Modal Overlay */}
      {success && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center -mt-20">
          <div 
            className="absolute inset-0 bg-[#2D2D2D]/80 backdrop-blur-md animate-in fade-in duration-500" 
            onClick={() => setSuccess(false)}
          />
          <div className="relative bg-white rounded-[3rem] w-[90%] max-w-lg p-10 md:p-14 text-center shadow-2xl animate-in zoom-in-95 duration-300">
             <button 
              onClick={() => setSuccess(false)}
              className="absolute top-8 right-8 text-gray-300 hover:text-gray-600 transition-colors"
             >
               <X className="w-6 h-6" />
             </button>
             
             <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-500 mx-auto mb-8 shadow-xl shadow-emerald-500/10">
                <CheckCircle2 className="w-12 h-12" />
             </div>
             
             <h2 className="text-4xl font-black text-[#2D2D2D] mb-4">Order Placed!</h2>
             <p className="text-gray-400 font-bold text-lg mb-10 leading-relaxed px-4">
               Your order will arrive in <span className="text-[#EE4444]">25-30 minutes</span>. Sit back and relax!
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
      className={`p-6 bg-white border-2 rounded-[2rem] cursor-pointer transition-all flex items-start gap-4 hover:shadow-lg ${
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

function PaymentOption({ label, icon, detail, active, onSelect }: any) {
  return (
    <div 
      onClick={onSelect}
      className={`p-6 bg-white border-2 rounded-[2rem] cursor-pointer transition-all flex items-center justify-between hover:shadow-lg ${
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
      <ChevronRight className={`w-4 h-4 transition-colors ${active ? "text-[#EE4444]" : "text-gray-300"}`} />
    </div>
  );
}
