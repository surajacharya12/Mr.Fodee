"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import {
  Package,
  Clock,
  MapPin,
  CheckCircle2,
  Bike,
  Star,
  RefreshCcw,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { orderApi } from "@/lib/api";

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState("Active");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await orderApi.getUserOrders(user.id);
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    }
  }, [user?.id, isLoggedIn]);

  const activeOrders = orders.filter((o) =>
    ["Pending", "Confirmed", "Preparing", "Out for Delivery"].includes(
      o.status,
    ),
  );

  const completedOrders = orders.filter((o) =>
    ["Delivered", "Cancelled"].includes(o.status),
  );

  const getStatusStep = (status: string) => {
    switch (status) {
      case "Pending":
        return 1;
      case "Confirmed":
        return 2;
      case "Preparing":
        return 2;
      case "Out for Delivery":
        return 3;
      case "Delivered":
        return 4;
      default:
        return 1;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#EE4444] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black text-[#2D2D2D] mb-2">
                My Orders
              </h1>
              <p className="text-gray-500 font-medium">
                Track your delicious moments
              </p>
            </div>

            <div className="flex items-center p-1 bg-gray-100 rounded-2xl w-fit">
              {["Active", "Completed"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-xl text-sm font-black transition-all ${
                    activeTab === tab
                      ? "bg-white text-[#EE4444] shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {!isLoggedIn ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold">
                Please login to view your orders
              </h2>
              <Link
                href="/login"
                className="text-[#EE4444] font-bold hover:underline"
              >
                Sign In Now
              </Link>
            </div>
          ) : activeTab === "Active" ? (
            <div className="space-y-8">
              {activeOrders.length > 0 ? (
                activeOrders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-[2.5rem] border border-orange-100 shadow-xl shadow-orange-100/50 overflow-hidden"
                  >
                    <div className="p-8 md:p-10">
                      <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
                        <div className="flex gap-6">
                          <div className="w-24 h-24 rounded-3xl bg-gray-50 overflow-hidden shrink-0 shadow-inner">
                            <img
                              src={
                                order.items[0]?.food?.image ||
                                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=200"
                              }
                              className="w-full h-full object-cover"
                              alt="Food"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-2xl font-black text-[#2D2D2D]">
                                Order {order._id.slice(-5).toUpperCase()}
                              </h3>
                              <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                                {order.status}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm font-bold mb-3">
                              {order.items
                                .map(
                                  (i: any) =>
                                    `${i.quantity}x ${i.food?.name || "Item"}`,
                                )
                                .join(", ")}
                            </p>
                            <div className="flex items-center gap-4">
                              <span className="text-2xl font-black text-[#2D2D2D]">
                                Rs. {order.totalAmount}
                              </span>
                              <div className="flex items-center gap-1.5 text-gray-400 font-bold text-xs bg-gray-50 px-3 py-1.5 rounded-full">
                                <Clock className="w-3.5 h-3.5" />
                                25-30 min
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="md:text-right flex flex-col justify-center">
                          <button className="h-14 px-10 bg-[#EE4444] text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-red-500/20 active:scale-[0.98]">
                            <Bike className="w-5 h-5" />
                            Track Live
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative pt-6">
                        <div className="flex justify-between mb-4">
                          {[
                            { label: "Placed", icon: CheckCircle2 },
                            { label: "Preparing", icon: Package },
                            { label: "On the way", icon: Bike },
                            { label: "Delivered", icon: MapPin },
                          ].map((step, i) => {
                            const currentStep = getStatusStep(order.status);
                            return (
                              <div
                                key={step.label}
                                className="flex flex-col items-center relative z-10"
                              >
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-lg transition-all ${
                                    i + 1 <= currentStep
                                      ? "bg-[#EE4444] text-white"
                                      : "bg-gray-100 text-gray-300"
                                  }`}
                                >
                                  <step.icon className="w-4 h-4" />
                                </div>
                                <p
                                  className={`mt-3 text-[10px] font-black uppercase tracking-widest ${
                                    i + 1 <= currentStep
                                      ? "text-[#EE4444]"
                                      : "text-gray-300"
                                  }`}
                                >
                                  {step.label}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                        {/* Progress line */}
                        <div className="absolute top-[2.4rem] left-0 w-full h-1 bg-gray-100 rounded-full">
                          <div
                            className="h-full bg-[#EE4444] rounded-full transition-all duration-1000"
                            style={{
                              width: `${((getStatusStep(order.status) - 1) / 3) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyOrders />
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {completedOrders.length > 0 ? (
                completedOrders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-4xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-gray-50 overflow-hidden shrink-0">
                          <img
                            src={order.items[0]?.food?.image}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            alt="Food"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#2D2D2D] mb-1 group-hover:text-[#EE4444] transition-colors">
                            Order #{order._id.slice(-5).toUpperCase()}
                          </h3>
                          <p className="text-xs text-gray-400 font-bold mb-2">
                            {new Date(order.createdAt).toLocaleDateString()} •{" "}
                            {order.items.length} items
                          </p>
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-black text-[#2D2D2D]">
                              Rs. {order.totalAmount}
                            </span>
                            <span
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                order.status === "Delivered"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-red-50 text-red-600"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 md:flex-col md:items-end justify-center">
                        <button className="h-12 px-8 bg-gray-50 text-gray-800 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-100 transition-all">
                          <RefreshCcw className="w-4 h-4" />
                          Reorder
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center text-gray-400">
                  No completed orders yet.
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function EmptyOrders() {
  return (
    <div className="bg-white rounded-[3rem] py-32 flex flex-col items-center text-center shadow-sm border border-gray-100">
      <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-8">
        <Package className="w-10 h-10" />
      </div>
      <h2 className="text-3xl font-black text-[#2D2D2D] mb-4">
        No active orders
      </h2>
      <p className="text-gray-400 max-w-sm mb-10 text-lg">
        Hungry? Order delicious food from the best restaurants around you!
      </p>
      <Link
        href="/menu"
        className="h-16 px-12 rounded-full bg-[#EE4444] text-white font-bold flex items-center justify-center shadow-xl shadow-[#EE4444]/25 hover:scale-105 transition-all"
      >
        Order Now
      </Link>
    </div>
  );
}
