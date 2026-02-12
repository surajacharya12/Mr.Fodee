"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { categoryApi, uploadApi } from "@/lib/api";
import { ChevronLeft, Save, Upload, Loader } from "lucide-react";

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    isActive: true
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { data } = await categoryApi.getById(id);
        setFormData({
          name: data.name,
          image: data.image,
          isActive: data.isActive
        });
      } catch (error) {
        console.error("Failed to fetch category:", error);
        alert("Failed to load category data");
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchCategory();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      alert("Please upload a category image");
      return;
    }

    setLoading(true);
    try {
      await categoryApi.update(id, formData);
      router.push("/categories");
    } catch (error) {
      console.error("Failed to update category:", error);
      alert("Failed to update category. Please try again.");
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

  if (fetching) return <div className="py-20 text-center text-gray-400">Loading category data...</div>;

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
           <h1 className="text-3xl font-black text-gray-800">Edit Category</h1>
           <p className="text-gray-500 font-medium">Update category details and status.</p>
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
                     <Upload className="w-8 h-8 text-gray-300 group-hover:text-[#EE4444] transition-colors mb-2" />
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
              Update Category
            </button>
         </div>
      </form>
    </div>
  );
}
