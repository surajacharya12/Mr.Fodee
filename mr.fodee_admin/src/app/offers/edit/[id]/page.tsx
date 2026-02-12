"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { offerApi, restaurantApi } from "@/lib/api";
import { ChevronLeft, Save, Tag, Calendar, Percent, Store, Loader } from "lucide-react";

export default function EditOfferPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    offerType: "discount",
    discountType: "percentage",
    discountValue: 0,
    couponCode: "",
    minOrderAmount: 0,
    gradientFrom: "#EE4444",
    gradientTo: "#FF8F73",
    icon: "percent",
    restaurant: "",
    startDate: "",
    endDate: "",
    isActive: true
  });

  useEffect(() => {
    fetchRestaurants();
    if (id) {
      fetchOffer();
    }
  }, [id]);

  const fetchRestaurants = async () => {
    try {
      const { data } = await restaurantApi.getAll();
      setRestaurants(data);
    } catch (error) {
      console.error("Failed to fetch restaurants", error);
    }
  };

  const fetchOffer = async () => {
    try {
      const { data } = await offerApi.getById(id);
      setFormData({
        title: data.title || "",
        subtitle: data.subtitle || "",
        offerType: data.offerType || "discount",
        discountType: data.discountType || "percentage",
        discountValue: data.discountValue || 0,
        couponCode: data.couponCode || "",
        minOrderAmount: data.minOrderAmount || 0,
        gradientFrom: data.gradientFrom || "#EE4444",
        gradientTo: data.gradientTo || "#FF8F73",
        icon: data.icon || "percent",
        restaurant: data.restaurant?._id || data.restaurant || "",
        startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : "",
        endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : "",
        isActive: data.isActive !== undefined ? data.isActive : true
      });
    } catch (error) {
      console.error("Failed to fetch offer:", error);
      alert("Failed to load offer data");
      router.push("/offers");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await offerApi.update(id, {
        ...formData,
        restaurant: formData.restaurant || null,
        discountValue: Number(formData.discountValue),
        minOrderAmount: Number(formData.minOrderAmount)
      });
      router.push("/offers");
    } catch (error) {
      console.error("Failed to update offer:", error);
      alert("Failed to update offer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader className="w-10 h-10 text-[#EE4444] animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Offer Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
           <h1 className="text-3xl font-black text-gray-800">Edit Offer</h1>
           <p className="text-gray-500 font-medium">Update promotional campaign details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Offer Title</label>
               <input 
                 type="text" 
                 name="title"
                 value={formData.title}
                 onChange={handleChange}
                 required
                 className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all outline-none"
               />
            </div>

            <div className="space-y-2 md:col-span-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Subtitle / Description</label>
               <input 
                 type="text" 
                 name="subtitle"
                 value={formData.subtitle}
                 onChange={handleChange}
                 required
                 className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all outline-none"
               />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Offer Type</label>
               <select 
                 name="offerType"
                 value={formData.offerType}
                 onChange={handleChange}
                 className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] transition-all outline-none"
               >
                 <option value="discount">Discount</option>
                 <option value="freeDelivery">Free Delivery</option>
                 <option value="express">Express Delivery</option>
                 <option value="newUser">New User Only</option>
               </select>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Coupon Code</label>
               <input 
                 type="text" 
                 name="couponCode"
                 value={formData.couponCode}
                 onChange={handleChange}
                 className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-mono font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] transition-all outline-none"
               />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Discount Type</label>
               <select 
                 name="discountType"
                 value={formData.discountType}
                 onChange={handleChange}
                 className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] transition-all outline-none"
               >
                 <option value="percentage">Percentage (%)</option>
                 <option value="flat">Flat Amount</option>
               </select>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Discount Value</label>
               <input 
                 type="number" 
                 name="discountValue"
                 value={formData.discountValue}
                 onChange={handleChange}
                 className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] transition-all outline-none"
               />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Restaurant (Optional)</label>
               <select 
                 name="restaurant"
                 value={formData.restaurant}
                 onChange={handleChange}
                 className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] transition-all outline-none"
               >
                 <option value="">All Restaurants (Platform-wide)</option>
                 {restaurants.map(rest => (
                   <option key={rest._id} value={rest._id}>{rest.name}</option>
                 ))}
               </select>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Icon</label>
               <select 
                 name="icon"
                 value={formData.icon}
                 onChange={handleChange}
                 className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] transition-all outline-none"
               >
                 <option value="percent">Percentage Icon</option>
                 <option value="tag">Tag Icon</option>
                 <option value="truck">Truck Icon</option>
                 <option value="star">Star Icon</option>
                 <option value="clock">Clock Icon</option>
               </select>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Start Date</label>
               <input 
                 type="date" 
                 name="startDate"
                 value={formData.startDate}
                 onChange={handleChange}
                 required
                 className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] transition-all outline-none"
               />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">End Date</label>
               <input 
                 type="date" 
                 name="endDate"
                 value={formData.endDate}
                 onChange={handleChange}
                 required
                 className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] transition-all outline-none"
               />
            </div>

            <div className="space-y-2 flex items-center md:col-span-2">
               <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl w-full cursor-pointer border border-transparent hover:bg-gray-100 transition-colors mt-2">
                  <input 
                    type="checkbox" 
                    name="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-5 h-5 text-[#EE4444] rounded focus:ring-[#EE4444]"
                  />
                  <span className="font-bold text-gray-700">Display this offer to users</span>
               </label>
            </div>
         </div>

         <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="h-14 px-8 bg-[#EE4444] text-white rounded-xl font-black text-lg shadow-xl shadow-red-500/30 hover:bg-red-600 transition-all flex items-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Offer
            </button>
         </div>
      </form>
    </div>
  );
}
