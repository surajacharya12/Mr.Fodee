"use client";

import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Search, User, CreditCard, Shield, HelpCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  const categories = [
    { icon: HelpCircle, name: "Order Issues", desc: "Problems with your current or previous order", slug: "order-issues" },
    { icon: User, name: "Account & Profile", desc: "Change settings, password, or profile info", slug: "account-profile" },
    { icon: CreditCard, name: "Payments & Refunds", desc: "Refund status, payment methods, or promo codes", slug: "payments-refunds" },
    { icon: Shield, name: "Security", desc: "Privacy concerns and account security", slug: "security" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Help Hero */}
        <div className="bg-[#2D2D2D] py-20 mb-16 relative overflow-hidden">
          <div className="max-w-screen-2xl mx-auto px-4 md:px-4 relative z-10 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-black mb-8">How can we help?</h1>
            <div className="max-w-2xl mx-auto relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-[#EE4444]" />
              <input 
                type="text" 
                placeholder="Searching for order tracking, refund status..."
                className="w-full h-16 pl-16 pr-6 rounded-3xl bg-white text-gray-800 outline-none focus:ring-4 focus:ring-[#EE4444]/20 transition-all text-lg"
              />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#EE4444]/10 rounded-l-full blur-3xl" />
        </div>

        <div className="max-w-screen-2xl mx-auto px-4 md:px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {categories.map((cat, i) => (
              <Link key={i} href={`/help/${cat.slug}`} className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 text-[#EE4444] flex items-center justify-center mb-6">
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{cat.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{cat.desc}</p>
                <div className="mt-6 flex items-center gap-1 text-[#EE4444] font-bold text-sm">
                  Learn more <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>

          {/* Top Articles / Accordion FAQ */}
          <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-gray-100 shadow-sm mb-20">
            <h2 className="text-3xl font-black text-[#2D2D2D] mb-10 text-center md:text-left">Popular Questions</h2>
            <div className="space-y-4">
              {[
                { 
                  q: "How to cancel my order?", 
                  a: "You can cancel your order within 60 seconds of placing it directly from the 'My Orders' screen. After this window, the restaurant begins preparation and cancellation is no longer possible." 
                },
                { 
                  q: "When will I receive my refund?", 
                  a: "Once approved, refunds are processed immediately. It usually takes 3-5 business days to reflect in your original payment method, depending on your bank's policy." 
                },
                { 
                  q: "Can I change the delivery address?", 
                  a: "You can update your address before the rider picks up the order. Tap on the order in 'My Orders' and select 'Change Address'. Note that changing distance might affect the delivery fee." 
                },
                { 
                  q: "How do I use a promo code?", 
                  a: "At the checkout page, look for the 'Apply Coupon' section. Enter your code and click 'Apply'. Discounts will be automatically deducted from your total bill." 
                },
                { 
                  q: "Is there a delivery fee?", 
                  a: "Delivery fees vary based on the distance between the restaurant and your location. You can see the exact fee at checkout before finalizing your order." 
                },
                { 
                  q: "How to report a damaged item?", 
                  a: "Go to 'My Orders', select the delivered order, and click 'Get Help'. Upload a photo of the damaged item and our support team will resolve it within 30 minutes." 
                },
                { 
                  q: "Can I schedule an order?", 
                  a: "Yes! At the restaurant page, select 'Schedule' instead of 'Deliver Now'. You can choose a time slot up to 48 hours in advance." 
                },
                { 
                  q: "My rider is taking too long", 
                  a: "You can track your rider's real-time location. If they are significantly delayed, use the 'Call Rider' button or tap 'Contact Support' for immediate assistance." 
                },
                { 
                  q: "How to delete my account?", 
                  a: "Go to Profile Settings > Account > Delete Account. Please note that this action is permanent and you will lose all your Fodee points and order history." 
                }
              ].map((faq, i) => (
                <details key={i} className="group border-b border-gray-50 last:border-0">
                  <summary className="flex items-center justify-between cursor-pointer py-6 hover:text-[#EE4444] transition-colors list-none">
                    <span className="text-lg font-bold text-gray-700 group-open:text-[#EE4444]">{faq.q}</span>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-open:rotate-180 transition-transform">
                      <ChevronRight className="w-4 h-4 text-gray-400 group-open:text-[#EE4444]" />
                    </div>
                  </summary>
                  <div className="pb-6 px-2">
                    <p className="text-gray-500 leading-relaxed text-base">
                      {faq.a}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Contact Support CTA */}
          <div className="bg-linear-to-r from-[#2D2D2D] to-[#1A1A1A] rounded-[3rem] p-10 md:p-16 text-center text-white relative overflow-hidden">
             <div className="relative z-10">
               <h2 className="text-3xl font-black mb-4">Still need help?</h2>
               <p className="text-white/60 mb-10 max-w-xl mx-auto">Our dedicated support team is available 24/7 to help you with any issues or queries you might have.</p>
               <div className="flex flex-wrap justify-center gap-4">
                 <button className="h-14 px-10 rounded-full bg-[#EE4444] text-white font-bold hover:scale-105 transition-all shadow-xl shadow-[#EE4444]/20">Contact Us</button>
                 <button className="h-14 px-10 rounded-full bg-white/10 text-white font-bold border border-white/20 hover:bg-white/20 transition-all">Chat with us</button>
               </div>
             </div>
             {/* Background Glow */}
             <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#EE4444]/10 rounded-full blur-[100px]" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
