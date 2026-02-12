"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { restaurantApi, uploadApi } from "@/lib/api";
import { ChevronLeft, Save, Upload, MapPin, Loader } from "lucide-react";

export default function AddRestaurantPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    foodCategory: "",
    description: "",
    restaurantImage: "",
    rating: "4.5",
    deliveryTime: "30-40 min",
    address: "",
    googleMapsLink: "",
    offer: "",
    isOpen: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        foodCategory: formData.foodCategory,
        description: formData.description,
        restaurantImage: formData.restaurantImage,
        rating: Number(formData.rating),
        deliveryTime: formData.deliveryTime,
        isOpen: formData.isOpen,
        googleMapsLink: formData.googleMapsLink,
        offer: formData.offer,
        location: {
           type: 'Point',
           coordinates: [0, 0], // Default coordinates, to be updated later via geocoding or link parsing if needed
           address: formData.address
        }
      };
      
      await restaurantApi.create(payload);
      router.push("/restaurants");
    } catch (error) {
      console.error("Failed to create restaurant:", error);
      alert("Failed to create restaurant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await uploadApi.uploadFile(file);
      setFormData(prev => ({ ...prev, restaurantImage: response.data.url }));
    } catch (error) {
      console.error("Upload failed", error);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

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
           <h1 className="text-3xl font-black text-gray-800">Add New Restaurant</h1>
           <p className="text-gray-500 font-medium">Onboard a new partner to the platform.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Restaurant Name</label>
               <input 
                 type="text" 
                 name="name"
                 value={formData.name}
                 onChange={handleChange}
                 required
                 className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all outline-none"
                 placeholder="e.g. Burger King"
               />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Category</label>
               <input 
                 type="text" 
                 name="foodCategory"
                 value={formData.foodCategory}
                 onChange={handleChange}
                 required
                 className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all outline-none"
                 placeholder="e.g. American, Fast Food"
               />
            </div>

            <div className="space-y-2 md:col-span-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Description</label>
               <textarea 
                 name="description"
                 value={formData.description}
                 onChange={handleChange}
                 required
                 rows={3}
                 className="w-full p-4 bg-gray-50 border border-transparent rounded-xl font-medium text-gray-700 focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all outline-none resize-none"
                 placeholder="Brief description of the restaurant..."
               />
            </div>

            <div className="space-y-2 md:col-span-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Restaurant Image</label>
               <div className="relative">
                 <input 
                   type="file" 
                   accept="image/*"
                   onChange={handleImageUpload}
                   className="hidden"
                   id="image-upload"
                 />
                 <label 
                   htmlFor="image-upload"
                   className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#EE4444] hover:bg-gray-50 transition-all group"
                 >
                   {formData.restaurantImage ? (
                     <img src={formData.restaurantImage} alt="Preview" className="h-full object-contain" />
                   ) : uploading ? (
                     <Loader className="w-8 h-8 text-[#EE4444] animate-spin" />
                   ) : (
                     <>
                       <Upload className="w-8 h-8 text-gray-300 group-hover:text-[#EE4444] transition-colors mb-2" />
                       <span className="text-sm font-bold text-gray-400 group-hover:text-[#EE4444]">Click to upload image</span>
                     </>
                   )}
                 </label>
               </div>
            </div>

            <div className="space-y-2 md:col-span-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Address</label>
               <input 
                 type="text" 
                 name="address"
                 value={formData.address}
                 onChange={handleChange}
                 className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all outline-none"
                 placeholder="Full street address"
               />
            </div>

            <div className="space-y-2 md:col-span-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Google Maps Link</label>
               <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="url" 
                    name="googleMapsLink"
                    value={formData.googleMapsLink}
                    onChange={handleChange}
                    className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all outline-none"
                    placeholder="https://maps.app.goo.gl/..."
                  />
               </div>
               <p className="text-xs text-gray-400 ml-1">Provide a Google Maps link to automatically determine location details.</p>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Current Offer Badge</label>
               <input 
                 type="text" 
                 name="offer"
                 value={formData.offer}
                 onChange={handleChange}
                 className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all outline-none"
                 placeholder="e.g. 50% OFF"
               />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Estimated Delivery Time</label>
               <input 
                 type="text" 
                 name="deliveryTime"
                 value={formData.deliveryTime}
                 onChange={handleChange}
                 className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all outline-none"
                 placeholder="e.g. 30-45 min"
               />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Initial Rating</label>
               <input 
                 type="number" 
                 step="0.1"
                 max="5"
                 name="rating"
                 value={formData.rating}
                 onChange={handleChange}
                 className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all outline-none"
               />
            </div>

            <div className="space-y-2 flex items-end">
               <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl w-full cursor-pointer border border-transparent hover:bg-gray-100 transition-colors">
                  <input 
                    type="checkbox" 
                    name="isOpen"
                    checked={formData.isOpen}
                    onChange={(e) => setFormData(prev => ({ ...prev, isOpen: e.target.checked }))}
                    className="w-5 h-5 text-[#EE4444] rounded focus:ring-[#EE4444]"
                  />
                  <span className="font-bold text-gray-700">Currently Open for Orders</span>
               </label>
            </div>
         </div>

         <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={loading || uploading}
              className="h-14 px-8 bg-[#EE4444] text-white rounded-xl font-black text-lg shadow-xl shadow-red-500/30 hover:bg-red-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Restaurant
            </button>
         </div>
      </form>
    </div>
  );
}
