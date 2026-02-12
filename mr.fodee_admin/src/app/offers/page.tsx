"use client";

import React, { useEffect, useState } from "react";
import { offerApi } from "@/lib/api";
import { Search, Plus, Tag, Calendar, Percent, Store, Settings, Trash2, Edit } from "lucide-react";
import Link from "next/link";

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const { data } = await offerApi.getAllAdmin();
      setOffers(data);
    } catch (error) {
      console.error("Failed to fetch offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async ( id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click if needed, though card has no click handler currently
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      await offerApi.delete(id);
      setOffers(offers.filter(o => o._id !== id));
    } catch (error) {
      console.error("Failed to delete offer:", error);
      alert("Failed to delete offer");
    }
  };

  const filteredOffers = offers.filter(offer => 
    offer.title?.toLowerCase().includes(search.toLowerCase()) || 
    offer.couponCode?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* ... header ... */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-gray-800">Offers & Promo</h1>
           <p className="text-gray-500 font-medium">Manage discount codes and promotional campaigns.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search offers..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#EE4444]/20 focus:border-[#EE4444] transition-all"
            />
          </div>
          <Link href="/offers/new">
            <button className="h-12 px-6 bg-[#EE4444] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 active:scale-95">
               <Plus className="w-5 h-5" />
               <span className="hidden md:inline">Create Offer</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           <div className="md:col-span-3 text-center py-20 text-gray-400">Loading offers...</div>
        ) : filteredOffers.length === 0 ? (
           <div className="md:col-span-3 text-center py-20 text-gray-400">No offers found.</div>
        ) : (
          filteredOffers.map((offer) => (
            <div key={offer._id} className="bg-white rounded-4xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden relative">
              <div 
                className="absolute top-0 left-0 w-full h-2" 
                style={{ background: `linear-gradient(to right, ${offer.gradientFrom || '#EE4444'}, ${offer.gradientTo || '#FF8F73'})` }} 
              />
              
              <div className="flex items-start justify-between mb-4 mt-2">
                 <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${offer.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                   {offer.isActive ? 'Active' : 'Expired'}
                 </span>
                 <div className="flex gap-2">
                   <Link href={`/offers/edit/${offer._id}`}>
                     <button className="text-gray-300 hover:text-blue-500 transition-colors">
                        <Edit className="w-4 h-4" />
                     </button>
                   </Link>
                   <button onClick={(e) => handleDelete(offer._id, e)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                   </button>
                 </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                 {/* ... icon logic ... */}
                 <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                    {offer.icon === 'percent' ? <Percent className="w-6 h-6" /> : <Tag className="w-6 h-6" />}
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-gray-800 leading-tight">{offer.title}</h3>
                    <p className="text-xs text-gray-400 font-medium">{offer.subtitle}</p>
                 </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between mb-4 border border-dashed border-gray-200">
                 <span className="text-xs font-bold text-gray-400 uppercase">Code</span>
                 <span className="font-mono font-black text-gray-700 text-lg tracking-widest">{offer.couponCode || "NO CODE"}</span>
              </div>

              <div className="flex items-center justify-between text-xs font-medium text-gray-400">
                 <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(offer.endDate).toLocaleDateString()}
                 </div>
                 {offer.restaurant && (
                   <div className="flex items-center gap-1 text-gray-500">
                      <Store className="w-3 h-3" />
                      {offer.restaurant.name}
                   </div>
                 )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
