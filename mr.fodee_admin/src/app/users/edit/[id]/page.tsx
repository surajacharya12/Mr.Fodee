"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { userApi, uploadApi } from "@/lib/api";
import { ChevronLeft, Save, Upload, Loader } from "lucide-react";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    profilePictureUrl: "",
    phoneNumber: ""
  });

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      const { data } = await userApi.getById(id);
      setFormData({
        username: data.username || "",
        email: data.email || "",
        profilePictureUrl: data.profilePictureUrl || "",
        phoneNumber: data.phoneNumber || ""
      });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      alert("Failed to load user data");
      router.push("/users");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userApi.update(id, formData);
      router.push("/users");
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update user. Please try again.");
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
      setFormData(prev => ({ ...prev, profilePictureUrl: response.data.url }));
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
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading User Data...</p>
      </div>
    );
  }

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
           <h1 className="text-3xl font-black text-gray-800">Edit User</h1>
           <p className="text-gray-500 font-medium">Update account information.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
         <div className="flex flex-col items-center mb-6">
            <div className="relative group cursor-pointer">
               <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg shadow-gray-200 flex items-center justify-center text-gray-400">
                  {formData.profilePictureUrl ? (
                    <img src={formData.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-black uppercase">{formData.username?.[0] || 'U'}</span>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <Upload className="text-white w-6 h-6" />
                  </div>
               </div>
               <input 
                 type="file" 
                 accept="image/*"
                 onChange={handleImageUpload}
                 className="absolute inset-0 opacity-0 cursor-pointer"
               />
               {uploading && (
                 <div className="absolute -bottom-2 bg-[#EE4444] text-white p-1 rounded-full shadow-lg">
                    <Loader className="w-4 h-4 animate-spin" />
                 </div>
               )}
            </div>
            <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Profile Picture</p>
         </div>

         <div className="space-y-4">
            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Username</label>
               <input 
                 type="text" 
                 name="username"
                 value={formData.username}
                 onChange={handleChange}
                 required
                 className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] transition-all outline-none"
               />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
               <input 
                 type="email" 
                 name="email"
                 value={formData.email}
                 onChange={handleChange}
                 required
                 className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] transition-all outline-none"
               />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Phone Number</label>
               <input 
                 type="tel" 
                 name="phoneNumber"
                 value={formData.phoneNumber}
                 onChange={handleChange}
                 placeholder="e.g. +977 9800000000"
                 className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:bg-white focus:border-[#EE4444] transition-all outline-none"
               />
            </div>
         </div>

         <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading || uploading}
              className="w-full h-14 bg-[#EE4444] text-white rounded-xl font-black text-lg shadow-xl shadow-red-500/30 hover:bg-red-600 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save User Profile
            </button>
         </div>
      </form>
    </div>
  );
}
