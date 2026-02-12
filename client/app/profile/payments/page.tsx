"use client";

import React from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { CreditCard, ShieldCheck, Wallet } from "lucide-react";

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-screen-xl mx-auto px-4 md:px-16">
          <div className="grid grid-cols-1 gap-8">
            {/* Accepted Payment Methods */}
            <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <ShieldCheck className="w-6 h-6 text-[#EE4444]" />
                <h3 className="text-2xl font-black text-gray-800">
                  Accepted Payment Methods
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visa */}
                <div className="flex items-center gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#EE4444] transition-all group">
                  <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-gray-800">Visa</h4>
                    <p className="text-sm font-bold text-gray-400">
                      Credit & Debit Cards
                    </p>
                  </div>
                </div>

                {/* Mastercard */}
                <div className="flex items-center gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#EE4444] transition-all group">
                  <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-gray-800">
                      Mastercard
                    </h4>
                    <p className="text-sm font-bold text-gray-400">
                      Credit & Debit Cards
                    </p>
                  </div>
                </div>

                {/* American Express */}
                <div className="flex items-center gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#EE4444] transition-all group">
                  <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-gray-800">
                      American Express
                    </h4>
                    <p className="text-sm font-bold text-gray-400">
                      Credit Cards
                    </p>
                  </div>
                </div>

                {/* Cash on Delivery */}
                <div className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 hover:border-emerald-300 transition-all">
                  <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-emerald-700">
                      Cash on Delivery
                    </h4>
                    <p className="text-sm font-bold text-emerald-600">
                      Pay when you receive
                    </p>
                  </div>
                </div>

                {/* eSewa */}
                <div className="flex items-center gap-4 p-6 rounded-2xl bg-green-50 border border-green-200 hover:border-green-400 transition-all">
                  <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        eSewa
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-green-700">eSewa</h4>
                    <p className="text-sm font-bold text-green-600">
                      Digital Wallet Payment
                    </p>
                  </div>
                </div>

                {/* Khalti */}
                <div className="flex items-center gap-4 p-6 rounded-2xl bg-purple-50 border border-purple-200 hover:border-purple-400 transition-all">
                  <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">K</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-purple-700">
                      Khalti
                    </h4>
                    <p className="text-sm font-bold text-purple-600">
                      Digital Wallet Payment
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
