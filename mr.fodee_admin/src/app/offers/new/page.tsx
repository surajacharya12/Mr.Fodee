"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { offerApi, restaurantApi } from "@/lib/api";
import { 
  ChevronLeft, 
  Save, 
  Tag, 
  Percent, 
  Calendar, 
  Loader, 
  Truck, 
  Clock, 
  Star,
  Gift
} from "lucide-react";

export default function AddOfferPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    offerType: "discount", // backend enum: discount, freeDelivery, express, newUser
    discountType: "percentage", // percentage, flat
    discountValue: "",
    couponCode: "",
    minOrderAmount: "",
    deliveryTime: "", // for 30 min express type
    restaurant: "",
    startDate: "",
    endDate: "",
    gradientFrom: "#EE4444",
    gradientTo: "#FF8F73",
    icon: "percent",
    isActive: true
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const { data } = await restaurantApi.getAll();
      setRestaurants(data);
    } catch (error) {
      console.error("Failed to fetch restaurants", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        minOrderAmount: Number(formData.minOrderAmount) || 0,
        discountValue: Number(formData.discountValue) || 0,
        deliveryTime: formData.deliveryTime ? Number(formData.deliveryTime) : null,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        restaurant: formData.restaurant === "" ? null : formData.restaurant
      };
      
      await offerApi.create(payload);
      router.push("/offers");
    } catch (error) {
      console.error("Failed to create offer:", error);
      alert("Failed to create offer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const iconOptions = [
    { value: 'percent', icon: Percent },
    { value: 'truck', icon: Truck },
    { value: 'clock', icon: Clock },
    { value: 'star', icon: Star },
    { value: 'tag', icon: Tag },
    { value: 'gift', icon: Gift },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
           <h1 className="text-3xl font-black text-gray-800">Create New Offer</h1>
           <p className="text-gray-500 font-medium">Launch a new promotional campaign.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
               <h2 className="text-lg font-black text-gray-800">Basic Information</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Title</label>
                     <input 
                       type="text" 
                       name="title"
                       value={formData.title}
                       onChange={handleChange}
                       required
                       className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all outline-none"
                       placeholder="e.g. Summer Sale"
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Subtitle</label>
                     <input 
                       type="text" 
                       name="subtitle"
                       value={formData.subtitle}
                       onChange={handleChange}
                       required
                       className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all outline-none"
                       placeholder="e.g. 50% OFF on all orders"
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Campaign Code</label>
                     <input 
                       type="text" 
                       name="couponCode"
                       value={formData.couponCode}
                       onChange={handleChange}
                       className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-black font-mono text-gray-700 focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all outline-none uppercase tracking-widest"
                       placeholder="SUMMER50"
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Offer Type</label>
                     <select 
                       name="offerType"
                       value={formData.offerType}
                       onChange={handleChange}
                       className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all outline-none appearance-none"
                     >
                       <option value="discount">Discount (Percentage/Flat)</option>
                       <option value="freeDelivery">Free Delivery</option>
                       <option value="express">30 Min Express</option>
                       <option value="newUser">New User Only</option>
                     </select>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Target Restaurant</label>
                  <select 
                    name="restaurant"
                    value={formData.restaurant}
                    onChange={handleChange}
                    className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all outline-none appearance-none"
                  >
                    <option value="">All Restaurants (Global Offer)</option>
                    {restaurants.map(rest => (
                      <option key={rest._id} value={rest._id}>{rest.name}</option>
                    ))}
                  </select>
               </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
               <h2 className="text-lg font-black text-gray-800">Rules & Limits</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formData.offerType === 'discount' && (
                    <>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Discount Type</label>
                         <select 
                           name="discountType"
                           value={formData.discountType}
                           onChange={handleChange}
                           className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all outline-none appearance-none"
                         >
                           <option value="percentage">Percentage Off (%)</option>
                           <option value="flat">Flat Amount Off ($)</option>
                         </select>
                      </div>

                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                            {formData.discountType === 'percentage' ? 'Percentage Value' : 'Flat Amount Value'}
                         </label>
                         <input 
                           type="number" 
                           name="discountValue"
                           value={formData.discountValue}
                           onChange={handleChange}
                           className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all outline-none"
                         />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Min Order Amount ($)</label>
                     <input 
                       type="number" 
                       name="minOrderAmount"
                       value={formData.minOrderAmount}
                       onChange={handleChange}
                       className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all outline-none"
                     />
                  </div>

                  {formData.offerType === 'express' && (
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Delivery Time (mins)</label>
                       <input 
                         type="number" 
                         name="deliveryTime"
                         value={formData.deliveryTime}
                         onChange={handleChange}
                         className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all outline-none"
                         placeholder="30"
                       />
                    </div>
                  )}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Valid From</label>
                     <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                          type="date" 
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          required
                          className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all outline-none"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Valid Until</label>
                     <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                          type="date" 
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                          required
                          className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all outline-none"
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
               <h2 className="text-lg font-black text-gray-800">Visual Settings</h2>
               
               <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Color Gradient</label>
                  <div className="flex items-center gap-3">
                     <div className="flex-1 space-y-2">
                        <input 
                          type="color" 
                          name="gradientFrom"
                          value={formData.gradientFrom}
                          onChange={handleChange}
                          className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent"
                        />
                     </div>
                     <div className="flex-1 space-y-2">
                        <input 
                          type="color" 
                          name="gradientTo"
                          value={formData.gradientTo}
                          onChange={handleChange}
                          className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent"
                        />
                     </div>
                  </div>
                  <div 
                    className="h-16 rounded-2xl w-full border border-white shadow-inner flex items-center justify-center text-white font-black uppercase tracking-widest text-xs"
                    style={{ background: `linear-gradient(to right, ${formData.gradientFrom}, ${formData.gradientTo})` }}
                  >
                    Preview Gradient
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Icon Style</label>
                  <div className="grid grid-cols-3 gap-3">
                     {iconOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, icon: opt.value }))}
                          className={`h-12 rounded-xl border flex items-center justify-center transition-all ${
                            formData.icon === opt.value 
                              ? "border-[#EE4444] bg-[#EE4444]/5 text-[#EE4444] shadow-sm transform scale-105" 
                              : "border-gray-100 bg-gray-50 text-gray-400 hover:bg-gray-100"
                          }`}
                        >
                           <opt.icon className="w-5 h-5" />
                        </button>
                     ))}
                  </div>
               </div>

               <div className="pt-4 flex items-center gap-4">
                  <div 
                    className="relative w-12 h-6 rounded-full bg-gray-200 cursor-pointer transition-colors"
                    onClick={() => setFormData(p => ({ ...p, isActive: !p.isActive }))}
                  >
                     <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all transform ${formData.isActive ? "translate-x-6 bg-[#EE4444]" : ""}`} />
                     <div className={`w-full h-full rounded-full ${formData.isActive ? "bg-red-100" : ""}`} />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Set as Active Campaign</span>
               </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-16 bg-[#EE4444] text-white rounded-2xl font-black text-lg shadow-xl shadow-red-500/30 hover:bg-red-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? <Loader className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
              Save Campaign
            </button>

            <button 
              type="button"
              onClick={() => router.back()}
              className="w-full h-14 bg-white text-gray-500 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
            >
               Discard Changes
            </button>
         </div>
      </form>
    </div>
  );
}
