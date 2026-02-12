"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { categoryApi, uploadApi } from "@/lib/api";
import { ChevronLeft, Save, Upload, Loader } from "lucide-react";
import toast from "react-hot-toast";

export default function AddCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    isActive: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error("Please upload a category image");
      return;
    }

    setLoading(true);
    try {
      await categoryApi.create(formData);
      toast.success("Category created successfully!");
      router.push("/categories");
    } catch (error) {
      console.error("Failed to create category:", error);
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="max-w-xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
           <h1 className="text-3xl font-black text-gray-800">Add New Category</h1>
           <p className="text-gray-500 font-medium">Create a new food category for the app.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
         <div className="space-y-6">
            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Category Name</label>
               <input 
                 type="text" 
                 name="name"
                 value={formData.name}
                 onChange={handleChange}
                 required
                 className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all outline-none"
                 placeholder="e.g. Pizza, Burger, Pizza"
               />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Category Image</label>
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
                   className={`w-full h-48 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden ${
                     formData.image ? 'border-emerald-100 bg-emerald-50/10' : 'border-gray-200 hover:border-[#EE4444] hover:bg-gray-50'
                   }`}
                 >
                   {formData.image ? (
                     <img src={formData.image} alt="Preview" className="w-full h-full object-contain p-4" />
                   ) : uploading ? (
                     <Loader className="w-8 h-8 text-[#EE4444] animate-spin" />
                   ) : (
                     <>
                       <Upload className="w-8 h-8 text-gray-300 group-hover:text-[#EE4444] transition-colors mb-2" />
                       <span className="text-sm font-bold text-gray-400 group-hover:text-[#EE4444]">Click to upload icon</span>
                     </>
                   )}
                 </label>
               </div>
            </div>

            <div className="space-y-2">
               <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl w-full cursor-pointer border border-transparent hover:bg-gray-100 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-5 h-5 text-[#EE4444] rounded focus:ring-[#EE4444]"
                  />
                  <div>
                    <span className="font-bold text-gray-700 block">Status</span>
                    <span className="text-xs text-gray-400">Show this category on the mobile app</span>
                  </div>
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
              Save Category
            </button>
         </div>
      </form>
    </div>
  );
}
