"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { foodApi, restaurantApi, uploadApi, categoryApi } from "@/lib/api";
import { ChevronLeft, Save, Upload, Loader, Utensils } from "lucide-react";
import toast from "react-hot-toast";

export default function AddFoodPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    restaurant: "",
    image: "",
    isVeg: true,
    isBestSeller: false
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [restRes, catRes] = await Promise.all([
        restaurantApi.getAll(),
        categoryApi.getAll()
      ]);
      setRestaurants(restRes.data);
      setCategories(catRes.data);
      
      // Set default category if available
      if (catRes.data.length > 0) {
        setFormData(prev => ({ ...prev, category: catRes.data[0]._id }));
      }
    } catch (error) {
      console.error("Failed to fetch initial data", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.restaurant) {
      toast.error("Please select a restaurant");
      return;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }
    if (!formData.image) {
      toast.error("Please upload an image");
      return;
    }
    setLoading(true);
    try {
      await foodApi.create({
        ...formData,
        price: Number(formData.price)
      });
      toast.success("Food item created successfully!");
      router.push("/food");
    } catch (error) {
      console.error("Failed to create food item:", error);
      toast.error("Failed to create food item");
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
    const toastId = toast.loading("Uploading image...");
    try {
      const response = await uploadApi.uploadFile(file);
      setFormData(prev => ({ ...prev, image: response.data.url }));
      toast.success("Image uploaded", { id: toastId });
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Upload failed", { id: toastId });
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
           <h1 className="text-3xl font-black text-gray-800">Add New Food</h1>
           <p className="text-gray-500 font-medium">Create a new menu item for a restaurant.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Food Name</label>
               <input 
                 type="text" 
                 name="name"
                 value={formData.name}
                 onChange={handleChange}
                 required
                 className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] outline-none transition-all"
                 placeholder="e.g. Pepperoni Pizza"
               />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Restaurant</label>
               <select 
                 name="restaurant"
                 value={formData.restaurant}
                 onChange={handleChange}
                 required
                 className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] outline-none transition-all"
               >
                 <option value="">Select Restaurant</option>
                 {restaurants.map(rest => (
                   <option key={rest._id} value={rest._id}>{rest.name}</option>
                 ))}
               </select>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Category</label>
               <select 
                 name="category"
                 value={formData.category}
                 onChange={handleChange}
                 required
                 className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] outline-none transition-all"
               >
                 <option value="">Select Category</option>
                 {categories.map(cat => (
                   <option key={cat._id} value={cat._id}>{cat.name}</option>
                 ))}
               </select>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Price (Rs.)</label>
               <input 
                 type="number" 
                 name="price"
                 value={formData.price}
                 onChange={handleChange}
                 required
                 className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] outline-none transition-all"
                 placeholder="e.g. 450"
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
                 className="w-full p-4 bg-gray-50 border border-transparent rounded-xl font-medium text-gray-700 focus:bg-white focus:border-[#EE4444] outline-none transition-all resize-none"
                 placeholder="Describe the food item..."
               />
            </div>

            <div className="space-y-2 md:col-span-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Food Image</label>
               <div className="relative">
                 <input 
                   type="file" 
                   accept="image/*"
                   onChange={handleImageUpload}
                   className="hidden"
                   id="food-image-upload"
                 />
                 <label 
                   htmlFor="food-image-upload"
                   className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#EE4444] hover:bg-gray-50 transition-all group"
                 >
                   {formData.image ? (
                     <img src={formData.image} alt="Preview" className="h-full object-contain" />
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

            <div className="flex gap-6 md:col-span-2">
               <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl flex-1 cursor-pointer hover:bg-gray-100 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={formData.isVeg}
                    onChange={(e) => setFormData(prev => ({ ...prev, isVeg: e.target.checked }))}
                    className="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-gray-700 block text-sm">Vegetarian</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Green Label</span>
                  </div>
               </label>

               <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl flex-1 cursor-pointer hover:bg-gray-100 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData(prev => ({ ...prev, isBestSeller: e.target.checked }))}
                    className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500"
                  />
                  <div>
                    <span className="font-bold text-gray-700 block text-sm">Bestseller</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Popular Tag</span>
                  </div>
               </label>
            </div>
         </div>

         <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={loading || uploading}
              className="h-14 px-8 bg-[#EE4444] text-white rounded-xl font-black text-lg shadow-xl shadow-red-500/30 hover:bg-red-600 transition-all flex items-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Create Food Item
            </button>
         </div>
      </form>
    </div>
  );
}
