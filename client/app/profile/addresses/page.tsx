"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { ChevronLeft, MapPin, Plus, Home, Briefcase, Navigation, Edit2, Trash2, CheckCircle2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { userApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

type Address = {
  _id: any; // Can be string or { $oid: string }
  type: string;
  detail: string;
  isDefault: boolean;
};

export default function AddressesPage() {
  const router = useRouter();
  const { user: authUser, updateUser } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [userId, setUserId] = useState<string | null>(authUser?.id || null);
  
  // New address form state
  const [newAddress, setNewAddress] = useState({
    type: "Home",
    detail: "",
    isDefault: false
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authUser) {
      setUserId(authUser.id);
      fetchAddresses(authUser.id);
    } else {
      setLoading(false);
    }
  }, [authUser]);

  const syncUserWithAddresses = (newAddresses: Address[]) => {
    if (authUser) {
      updateUser({
        ...authUser,
        addresses: newAddresses.map(addr => ({
          ...addr,
          _id: typeof addr._id === 'object' ? addr._id.$oid : addr._id
        }))
      });
    }
  };

  const fetchAddresses = async (id: string) => {
    try {
      setLoading(true);
      // Fetch fresh user data to get addresses
      const response = await userApi.getById(id);
      // Ensure addresses exists
      setAddresses(response.data.addresses || []);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    try {
      setSubmitting(true);
      const response = await userApi.addAddress(userId, newAddress);
      // The backend returns the updated list of addresses
      const updatedAddresses = response.data;
      setAddresses(updatedAddresses);
      syncUserWithAddresses(updatedAddresses);
      setShowAddForm(false);
      setNewAddress({ type: "Home", detail: "", isDefault: false });
      toast.success("Address added successfully");
    } catch (error) {
      console.error("Failed to add address:", error);
      toast.error("Failed to add address");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!userId || !confirm("Are you sure you want to delete this address?")) return;
    
    try {
      const response = await userApi.deleteAddress(userId, addressId);
      const updatedAddresses = response.data;
      setAddresses(updatedAddresses);
      syncUserWithAddresses(updatedAddresses);
      toast.success("Address deleted");
    } catch (error) {
      console.error("Failed to delete address:", error);
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (addressId: string) => {
    if (!userId) return;
    
    try {
      const response = await userApi.updateAddress(userId, addressId, { isDefault: true });
      const updatedAddresses = response.data;
      setAddresses(updatedAddresses);
      syncUserWithAddresses(updatedAddresses);
      toast.success("Default address updated");
    } catch (error) {
      console.error("Failed to set default address:", error);
      toast.error("Failed to update default address");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "Home": return Home;
      case "Work": return Briefcase;
      default: return Navigation;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-screen-xl mx-auto px-4 md:px-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-400 hover:text-[#EE4444] font-bold mb-4 transition-colors group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back to Profile
              </button>
              <h1 className="text-4xl font-black text-[#2D2D2D]">Saved Addresses</h1>
            </div>
            
            <button 
              onClick={() => setShowAddForm(true)}
              className="h-14 px-8 bg-[#EE4444] text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-red-500/20 active:scale-[0.98]"
            >
              <Plus className="w-5 h-5" />
              Add New Address
            </button>
          </div>

          {/* Add Address Form Modal/Inline */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-8 w-full max-w-md relative animate-in fade-in zoom-in duration-200">
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
                
                <h2 className="text-2xl font-black text-[#2D2D2D] mb-6">New Address</h2>
                
                <form onSubmit={handleAddAddress} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Label</label>
                    <div className="flex gap-4">
                      {["Home", "Work", "Other"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setNewAddress({...newAddress, type})}
                          className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${
                            newAddress.type === type 
                              ? "border-[#EE4444] bg-red-50 text-[#EE4444]" 
                              : "border-gray-100 text-gray-500 hover:border-gray-200"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Address Detail</label>
                    <textarea 
                      required
                      value={newAddress.detail}
                      onChange={(e) => setNewAddress({...newAddress, detail: e.target.value})}
                      placeholder="e.g. House #123, Street Name, City"
                      className="w-full h-32 p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/10 transition-all font-medium text-gray-700 outline-none resize-none"
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${newAddress.isDefault ? "bg-[#EE4444] border-[#EE4444]" : "border-gray-300 group-hover:border-[#EE4444]"}`}>
                      {newAddress.isDefault && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden"
                      checked={newAddress.isDefault}
                      onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                    />
                    <span className="font-bold text-gray-600">Set as default address</span>
                  </label>

                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full h-14 bg-[#EE4444] text-white rounded-2xl font-black shadow-xl shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Saving..." : "Save Address"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {loading ? (
             <div className="flex justify-center p-20">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EE4444]"></div>
             </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <MapPin className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No addresses saved</h3>
              <p className="text-gray-400">Add your delivery locations to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {addresses.map((addr) => {
                const Icon = getIcon(addr.type);
                return (
                  <div key={addr._id} className={`bg-white rounded-[2.5rem] p-8 border transition-all group relative overflow-hidden ${addr.isDefault ? "border-[#EE4444] shadow-md shadow-red-100" : "border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50"}`}>
                    <div className="flex items-start justify-between relative z-10">
                      <div className="flex items-start gap-6">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all shrink-0 ${addr.isDefault ? "bg-red-50 text-[#EE4444]" : "bg-gray-50 text-gray-400 group-hover:bg-red-50 group-hover:text-[#EE4444]"}`}>
                          <Icon className="w-8 h-8" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-black text-gray-800">{addr.type}</h3>
                            {addr.isDefault && (
                              <span className="px-3 py-1 bg-[#EE4444] text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-red-500/20">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-gray-500 font-medium leading-relaxed max-w-sm mb-4">
                            {addr.detail}
                          </p>
                          
                          {!addr.isDefault && (
                             <button
                               onClick={() => handleSetDefault(addr._id)}
                               className="text-xs font-bold text-gray-400 hover:text-[#EE4444] underline decoration-gray-200 hover:decoration-[#EE4444] transition-all"
                             >
                               Set as default
                             </button>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="w-10 h-10 rounded-full hover:bg-red-50 flex items-center justify-center text-gray-300 hover:text-[#EE4444] transition-colors"
                          title="Delete Address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Decorative circle */}
                    <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full transition-colors ${addr.isDefault ? "bg-red-50" : "bg-gray-50 group-hover:bg-red-50"}`} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
