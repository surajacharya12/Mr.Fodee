"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { Camera, ChevronLeft, Save, User, Mail, Phone, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    location: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFormData({
        id: user.id,
        name: user.username || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        location: "Kathmandu, Nepal" // Default location
      });
      if (user.profilePictureUrl) {
        setImagePreview(user.profilePictureUrl);
      }
    }
  }, []);

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle save changes
  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Update user data in localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const updatedUser = {
          ...user,
          username: formData.name,
          email: formData.email,
          phoneNumber: formData.phone,
          profilePictureUrl: imagePreview || user.profilePictureUrl
        };
        
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // TODO: Send update to backend API
        // const response = await fetch(`http://localhost:3001/user/users/${formData.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(updatedUser)
        // });
        
        alert("Profile updated successfully!");
        router.push("/profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-[#EE4444] font-bold mb-8 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Profile
          </button>

          <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 md:p-12">
              <h1 className="text-3xl font-black text-[#2D2D2D] mb-10">Edit Profile</h1>

              {/* Profile Image Upload */}
              <div className="flex flex-col items-center mb-12">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full border-4 border-gray-50 overflow-hidden shadow-xl ring-4 ring-red-50 group-hover:ring-red-100 transition-all">
                    <img 
                      src={imagePreview || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label htmlFor="edit-profile-image" className="absolute bottom-1 right-1 w-10 h-10 bg-[#EE4444] text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform border-4 border-white">
                    <Camera className="w-4 h-4" />
                    <input 
                      id="edit-profile-image"
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden" 
                    />
                  </label>
                </div>
                <p className="mt-4 text-xs font-black text-gray-300 uppercase tracking-widest">Change Photo</p>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full h-14 pl-14 pr-6 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all font-bold text-gray-700 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full h-14 pl-14 pr-6 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all font-bold text-gray-700 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full h-14 pl-14 pr-6 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all font-bold text-gray-700 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Primary Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full h-14 pill-14 pr-6 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all font-bold text-gray-700 outline-none"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSave}
                disabled={loading}
                className="w-full mt-12 h-16 bg-[#EE4444] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-red-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
