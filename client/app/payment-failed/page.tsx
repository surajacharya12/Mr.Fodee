"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { XCircle } from "lucide-react";

export default function PaymentFailedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <main className="pt-32 pb-20 flex items-center justify-center">
        <div className="max-w-md w-full mx-4 bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100 text-center">
          <div className="space-y-8">
            <div className="w-24 h-24 rounded-full bg-red-50 border-4 border-red-100 flex items-center justify-center text-[#EE4444] mx-auto shadow-xl shadow-red-500/10">
              <XCircle className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-[#2D2D2D] mb-4">Payment Failed</h2>
              <p className="text-gray-400 font-bold text-lg leading-relaxed">
                Your payment was cancelled or failed. Please try again or choose a different payment method.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => router.push("/checkout")}
                className="h-16 rounded-2xl bg-[#EE4444] text-white font-black text-lg hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
              >
                Return to Checkout
              </button>
              <button 
                onClick={() => router.push("/")}
                className="h-16 rounded-2xl bg-gray-50 text-gray-800 font-black text-lg hover:bg-gray-100 transition-all border border-gray-100"
              >
                Back Home
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
