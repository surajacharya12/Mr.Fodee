"use client";

import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { 
  Bell, 
  ChevronLeft, 
  Trash2, 
  Circle, 
  Clock, 
  ShoppingBag, 
  Tag, 
  Info,
  CheckCheck
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const router = useRouter();

  const notifications = [
    {
      id: 1,
      title: "Order Delivered!",
      message: "The Italian Corner has delivered your order. Enjoy your meal!",
      type: "order",
      time: "2 mins ago",
      isRead: false,
      icon: ShoppingBag,
      color: "text-emerald-500 bg-emerald-50"
    },
    {
      id: 2,
      title: "Flash Sale Alert ⚡",
      message: "Get 50% OFF on all Sushi items for the next 2 hours. Don't miss out!",
      type: "promo",
      time: "1 hour ago",
      isRead: false,
      icon: Tag,
      color: "text-[#EE4444] bg-red-50"
    },
    {
      id: 3,
      title: "Wallet Topped Up",
      message: "Success! $100.00 has been added to your Fodee Wallet.",
      type: "info",
      time: "Yesterday",
      isRead: true,
      icon: Info,
      color: "text-blue-500 bg-blue-50"
    },
    {
      id: 4,
      title: "Rider is nearby",
      message: "Your rider is just 500m away from your location.",
      type: "order",
      time: "Yesterday",
      isRead: true,
      icon: ShoppingBag,
      color: "text-emerald-500 bg-emerald-50"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-400 hover:text-[#EE4444] font-bold mb-4 transition-colors group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back to Profile
              </button>
              <h1 className="text-4xl font-black text-[#2D2D2D]">Notifications</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="h-12 px-6 rounded-xl bg-white border border-gray-100 text-gray-500 font-bold text-xs hover:text-[#EE4444] transition-all flex items-center gap-2 shadow-sm">
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </button>
              <button className="h-12 w-12 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-red-500 transition-all flex items-center justify-center shadow-sm">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`p-6 md:p-8 flex items-start gap-6 hover:bg-gray-50/50 transition-all cursor-pointer relative group ${!notif.isRead ? 'bg-red-50/20' : ''}`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${notif.color} transition-transform group-hover:scale-110 shadow-sm`}>
                      <notif.icon className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-lg transition-colors group-hover:text-[#EE4444] ${notif.isRead ? 'font-bold text-gray-800' : 'font-black text-[#2D2D2D]'}`}>
                          {notif.title}
                        </h3>
                        {!notif.isRead && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#EE4444] shadow-lg shadow-red-500/50" />
                        )}
                      </div>
                      <p className={`text-sm leading-relaxed mb-4 ${notif.isRead ? 'text-gray-400 font-medium' : 'text-gray-600 font-bold'}`}>
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-2 text-gray-300 font-bold text-[10px] uppercase tracking-widest">
                        <Clock className="w-3.5 h-3.5" />
                        {notif.time}
                      </div>
                    </div>

                    {/* Desktop Hover Actions */}
                    <div className="absolute right-8 bottom-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                       <button className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-red-500">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-6">
                  <Bell className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-[#2D2D2D] mb-2">No notifications yet</h3>
                <p className="text-gray-400 font-medium max-w-xs">We'll let you know when something important happens.</p>
              </div>
            )}
          </div>

          <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-widest mt-12 mb-20 px-8">
            Manage your notification preferences in <span className="text-[#EE4444] cursor-pointer hover:underline" onClick={() => router.push('/settings')}>Settings</span>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
