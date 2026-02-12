"use client";

import React, { useEffect, useState } from "react";
import { restaurantApi } from "@/lib/api";
import { Search, Plus, MapPin, Star, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const { data } = await restaurantApi.getAll();
      setRestaurants(data);
    } catch (error) {
      console.error("Failed to fetch restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter(rest => 
    rest.name?.toLowerCase().includes(search.toLowerCase()) || 
    rest.foodCategory?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this restaurant?")) return;
    try {
      await restaurantApi.delete(id);
      setRestaurants(restaurants.filter(r => r._id !== id));
    } catch (error) {
      console.error("Failed to delete restaurant:", error);
      alert("Failed to delete restaurant");
    }
  };

  return (
    <div className="space-y-8">
      {/* ... header ... */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-gray-800">Restaurants</h1>
           <p className="text-gray-500 font-medium">Manage restaurant listings and partnerships.</p>
        </div>
        {/* ... search ... */}
        <div className="flex gap-4">
          <div className="relative flex-1 md:w-64">
             {/* ... */}
            <input 
              type="text" 
              placeholder="Search restaurants..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#EE4444]/20 focus:border-[#EE4444] transition-all"
            />
          </div>
          <Link href="/restaurants/new">
            <button className="h-12 px-6 bg-[#EE4444] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 active:scale-95">
               <Plus className="w-5 h-5" />
               <span className="hidden md:inline">Add New</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* ... table head ... */}
            <thead className="bg-checkered bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Restaurant</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading restaurants...</td>
                </tr>
              ) : filteredRestaurants.length === 0 ? (
                <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No restaurants found.</td>
                </tr>
              ) : (
                filteredRestaurants.map((rest) => (
                  <tr key={rest._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden relative shadow-sm shrink-0">
                           {rest.restaurantImage ? (
                             <img src={rest.restaurantImage} alt="" className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full bg-orange-50 flex items-center justify-center text-orange-400 font-bold text-xs">IMG</div>
                           )}
                         </div>
                         <div>
                           <p className="font-bold text-gray-800">{rest.name}</p>
                           <p className="text-xs text-gray-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {rest.distance} km away
                           </p>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold uppercase tracking-wide">
                        {rest.foodCategory}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-bold text-gray-700">
                         <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                         {rest.rating}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`w-2 h-2 rounded-full inline-block mr-2 ${rest.isOpen ? 'bg-emerald-500' : 'bg-red-500'}`} />
                       <span className={`text-sm font-bold ${rest.isOpen ? 'text-emerald-500' : 'text-red-500'}`}>
                          {rest.isOpen ? 'Open' : 'Closed'}
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                         <Link href={`/restaurants/edit/${rest._id}`}>
                            <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                               <Edit className="w-4 h-4" />
                            </button>
                         </Link>
                         <button 
                           onClick={() => handleDelete(rest._id)}
                           className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                         >
                            <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && filteredRestaurants.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/30 text-xs font-bold text-gray-400 text-right">
             Showing {filteredRestaurants.length} restaurants
          </div>
        )}
      </div>
    </div>
  );
}
