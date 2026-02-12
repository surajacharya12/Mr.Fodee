"use client";

import React from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { 
  ChevronLeft, 
  HelpCircle, 
  ChevronRight, 
  Search,
  MessageCircle,
  Phone,
  Clock,
  ExternalLink
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const CATEGORY_DATA: Record<string, any> = {
  "order-issues": {
    title: "Order Issues",
    desc: "Problems with your current or previous order",
    articles: [
      { q: "My order is delayed, what should I do?", a: "You can track your rider's real-time location on the map. If the order is significantly late, you can call the rider directly or contact our support team." },
      { q: "Item is missing from my order", a: "We're sorry! Please report missing items through the 'Help' section of that specific order in your history. We'll issue a refund for the missing items immediately." },
      { q: "Order was delivered but I didn't receive it", a: "Check with neighbors or your building's reception first. If you still can't find it, contact us within 24 hours for a full investigation." },
      { q: "Received the wrong items", a: "Please take a photo of the items you received and the receipt. Report it via the app to receive a full refund or redelivery." }
    ]
  },
  "account-profile": {
    title: "Account & Profile",
    desc: "Change settings, password, or profile info",
    articles: [
      { q: "How to change my phone number?", a: "Go to Profile > Edit Profile > Phone Number. You'll need to verify your new number with an OTP." },
      { q: "Can I use multiple accounts?", a: "To ensure fair play and security, we recommend using only one account per person. Multiple accounts might be flagged for review." },
      { q: "Resetting my password", a: "If you've forgotten your password, click 'Forgot Password' on the login screen. We'll send an email with a reset link." },
      { q: "Managing email notifications", a: "You can toggle all notifications in the Profile Settings > Preferences section." }
    ]
  },
  "payments-refunds": {
    title: "Payments & Refunds",
    desc: "Refund status, payment methods, or promo codes",
    articles: [
      { q: "Why was my payment declined?", a: "Common reasons include insufficient funds, expired cards, or incorrect CVV. Please check with your bank or try a different payment method." },
      { q: "Where is my refund?", a: "Refunds typically take 3-5 business days to appear in your account after processing. Bank timelines vary." },
      { q: "How to apply a promo code?", a: "Enter the code in the 'Apply Coupon' field at checkout before placing your order. Only one code per order is allowed." },
      { q: "Can I pay with cash?", a: "Yes, we accept Cash on Delivery for most restaurants. You'll see this option at checkout if available for your order." }
    ]
  },
  "security": {
    title: "Security",
    desc: "Privacy concerns and account security",
    articles: [
      { q: "How Fodee protects my data?", a: "We use enterprise-grade encryption for all your personal data and payment info. We never sell your data to third parties." },
      { q: "Reporting suspicious activity", a: "If you notice an order you didn't place, contact us immediately and freeze your saved cards." },
      { q: "What is Two-Factor Authentication?", a: "2FA adds an extra layer of security by requiring a code from your phone whenever you log in from a new device." },
      { q: "I lost access to my email", a: "Please contact our support team with your phone number and last order details so we can help restore your account." }
    ]
  }
};

export default function HelpCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const data = CATEGORY_DATA[slug];

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-[#EE4444] font-bold mb-8 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Help Center
          </button>

          <header className="mb-12">
             <div className="inline-block p-4 bg-white rounded-3xl border border-gray-100 shadow-sm mb-6">
                <HelpCircle className="w-8 h-8 text-[#EE4444]" />
             </div>
             <h1 className="text-4xl font-black text-[#2D2D2D] mb-4">{data.title}</h1>
             <p className="text-gray-500 text-lg font-medium">{data.desc}</p>
          </header>

          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mb-12">
             <div className="divide-y divide-gray-50">
                {data.articles.map((item: any, i: number) => (
                  <details key={i} className="group outline-none">
                    <summary className="flex items-center justify-between p-8 cursor-pointer list-none group-open:bg-gray-50/50 transition-all">
                       <span className="text-xl font-bold text-gray-800 group-open:text-[#EE4444] pr-10">{item.q}</span>
                       <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 group-open:rotate-90 transition-transform">
                          <ChevronRight className="w-5 h-5 text-gray-400 group-open:text-[#EE4444]" />
                       </div>
                    </summary>
                    <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                       <p className="text-gray-500 text-lg leading-relaxed">
                          {item.a}
                       </p>
                       <div className="mt-6 flex items-center gap-4">
                          <button className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-[#EE4444] transition-colors">Was this helpful?</button>
                          <div className="flex gap-2">
                             <button className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-emerald-50 hover:text-emerald-500 transition-all flex items-center justify-center text-gray-400">👍</button>
                             <button className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center text-gray-400">👎</button>
                          </div>
                       </div>
                    </div>
                  </details>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-[#EE4444] transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#EE4444] flex items-center justify-center">
                      <MessageCircle className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="font-bold text-gray-800">Chat with us</p>
                      <p className="text-xs text-gray-400 font-medium">Wait time: ~2 mins</p>
                   </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#EE4444] group-hover:translate-x-1 transition-all" />
             </div>

             <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-[#EE4444] transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-red-50 group-hover:text-[#EE4444] transition-all">
                      <Phone className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="font-bold text-gray-800">Call Support</p>
                      <p className="text-xs text-gray-400 font-medium">Available 24/7</p>
                   </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#EE4444] group-hover:translate-x-1 transition-all" />
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
