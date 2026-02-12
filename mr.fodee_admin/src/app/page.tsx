"use client";

import React, { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import Link from "next/link";
import toast from "react-hot-toast";
import { 
  Users, 
  Store, 
  Tag, 
  DollarSign, 
  TrendingUp, 
  Activity 
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await adminApi.getStats();
      setStats(data);
    } catch (error: any) {
      console.error("Failed to fetch admin stats:", error);
      
      if (error.code === 'ERR_NETWORK') {
        toast.error("Cannot connect to server. Please make sure the backend is running on port 3001.");
      } else if (error.response) {
        console.error("Server Error Data:", error.response.data);
        toast.error(`Server error: ${error.response.data.error || 'Unknown error'}`);
      } else {
        toast.error("Failed to load dashboard stats");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-[#EE4444] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    { 
      label: "Total Users", 
      value: stats?.counts?.users || 0, 
      icon: Users, 
      color: "text-blue-500 bg-blue-50",
      change: "+12% this month"
    },
    { 
      label: "Restaurants", 
      value: stats?.counts?.restaurants || 0, 
      icon: Store, 
      color: "text-emerald-500 bg-emerald-50",
      change: "+5 new partnerships"
    },
    { 
      label: "Active Offers", 
      value: stats?.counts?.offers || 0, 
      icon: Tag, 
      color: "text-purple-500 bg-purple-50",
      change: "Performing well"
    },
    { 
      label: "Food Categories", 
      value: stats?.counts?.categories || 0, 
      icon: Activity, 
      color: "text-orange-500 bg-orange-50",
      change: "Across all cuisines"
    },
  ];

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-800">Administrator Dashboard</h1>
        <p className="text-gray-500 font-medium">Overview of your platform's performance</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {card.change}
              </span>
            </div>
            <h3 className="text-3xl font-black text-gray-800 mb-1">{card.value}</h3>
            <p className="text-gray-400 font-medium text-sm">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Users */}
        <section className="bg-white rounded-4xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-500" />
              Newest Members
            </h2>
            <button className="text-sm font-bold text-blue-500 hover:text-blue-600">View All</button>
          </div>
          <div className="space-y-4">
            {stats?.recent?.users?.map((user: any) => (
              <div key={user._id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold uppercase text-sm">
                    {user.username?.[0] || "U"}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{user.username}</p>
                    <p className="text-xs text-gray-400 font-medium">{user.email}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-300">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
            {(!stats?.recent?.users || stats.recent.users.length === 0) && (
              <p className="text-gray-400 text-center py-4">No recent users found.</p>
            )}
          </div>
        </section>

        {/* Recent Restaurants */}
        <section className="bg-white rounded-4xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-3">
              <Store className="w-5 h-5 text-emerald-500" />
              Recent Partners
            </h2>
            <button className="text-sm font-bold text-emerald-500 hover:text-emerald-600">View All</button>
          </div>
          <div className="space-y-4">
            {stats?.recent?.restaurants?.map((rest: any) => (
              <div key={rest._id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{rest.name}</p>
                    <p className="text-xs text-gray-400 font-medium">{rest.foodCategory} • {rest.rating} ★</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${rest.isOpen ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                  {rest.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
            ))}
            {(!stats?.recent?.restaurants || stats.recent.restaurants.length === 0) && (
              <p className="text-gray-400 text-center py-4">No recent restaurants found.</p>
            )}
          </div>
        </section>

        {/* Recent Categories */}
        <section className="bg-white rounded-4xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-3">
              <Activity className="w-5 h-5 text-orange-500" />
              Recent Categories
            </h2>
            <Link href="/categories" className="text-sm font-bold text-orange-500 hover:text-orange-600">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats?.recent?.categories?.map((cat: any) => (
              <div key={cat._id} className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-2xl group hover:bg-orange-50 transition-colors">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <img src={cat.image} alt="" className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-black text-gray-700 group-hover:text-orange-600 truncate w-full text-center">{cat.name}</p>
              </div>
            ))}
            {(!stats?.recent?.categories || stats.recent.categories.length === 0) && (
              <p className="col-span-3 text-gray-400 text-center py-4">No categories created.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
