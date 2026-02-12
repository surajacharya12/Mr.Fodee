"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { foodApi, restaurantApi, uploadApi, categoryApi } from "@/lib/api";
import { ChevronLeft, Save, Upload, Loader } from "lucide-react";

export default function EditFoodPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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
  }, [id]);

  const fetchInitialData = async () => {
    try {
      const [restRes, catRes, foodRes] = await Promise.all([
        restaurantApi.getAll(),
        categoryApi.getAll(),
        foodApi.getById(id)
      ]);
      
      setRestaurants(restRes.data);
      setCategories(catRes.data);
      
      const data = foodRes.data;
      setFormData({
        name: data.name || "",
        description: data.description || "",
        price: String(data.price) || "",
        category: data.category?._id || data.category || "",
        restaurant: data.restaurant?._id || data.restaurant || "",
        image: data.image || "",
        isVeg: data.isVeg !== undefined ? data.isVeg : true,
        isBestSeller: data.isBestSeller || false
      });
    } catch (error) {
      console.error("Failed to fetch initial data", error);
      alert("Failed to load food data");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await foodApi.update(id, {
        ...formData,
        price: Number(formData.price)
      });
      router.push("/food");
    } catch (error) {
      console.error("Failed to update food item:", error);
      alert("Failed to update food item");
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
      setFormData(prev => ({ ...prev, image: response.data.url }));
    } catch (error) {
      console.error("Upload failed", error);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader className="w-10 h-10 text-[#EE4444] animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Food Data...</p>
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
           <h1 className="text-3xl font-black text-gray-800">Edit Food Item</h1>
           <p className="text-gray-500 font-medium">Update menu item details and preference.</p>
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
                   id="edit-food-image"
                 />
                 <label 
                   htmlFor="edit-food-image"
                   className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#EE4444] hover:bg-gray-50 transition-all group"
                 >
                   {formData.image ? (
                     <div className="relative h-full p-2">
                        <img src={formData.image} alt="Preview" className="h-full object-contain" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                           <Upload className="text-white w-6 h-6" />
                        </div>
                     </div>
                   ) : uploading ? (
                     <Loader className="w-8 h-8 text-[#EE4444] animate-spin" />
                   ) : (
                     <>
                       <Upload className="w-8 h-8 text-gray-300 group-hover:text-[#EE4444] transition-colors mb-2" />
                       <span className="text-sm font-bold text-gray-400 group-hover:text-[#EE4444]">Click to change image</span>
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
              Save Changes
            </button>
         </div>
      </form>
    </div>
  );
}
