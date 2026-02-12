"use client";

import React, { useEffect, useState } from "react";
import { foodApi } from "@/lib/api";
import { Search, Plus, Utensils, Star, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function FoodItemsPage() {
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const { data } = await foodApi.getAll();
      setFoods(data);
    } catch (error) {
      console.error("Failed to fetch food items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this food item?")) return;
    try {
      await foodApi.delete(id);
      setFoods(foods.filter(f => f._id !== id));
      toast.success("Food item deleted");
    } catch (error) {
      console.error("Failed to delete food item:", error);
      toast.error("Failed to delete food item");
    }
  };

  const filteredFoods = foods.filter(food => {
    const catName = food.category?.name || food.category || "";
    return (
      food.name?.toLowerCase().includes(search.toLowerCase()) || 
      String(catName).toLowerCase().includes(search.toLowerCase()) ||
      food.restaurant?.name?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-gray-800">Food Items</h1>
           <p className="text-gray-500 font-medium">Manage menu items across all restaurants.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search food, category, restaurant..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#EE4444]/20 focus:border-[#EE4444] transition-all"
            />
          </div>
          <Link href="/food/new">
            <button className="h-12 px-6 bg-[#EE4444] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 active:scale-95">
               <Plus className="w-5 h-5" />
               <span className="hidden md:inline">Add Food</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-checkered bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Food Item</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Restaurant</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Loading food items...</td>
                </tr>
              ) : filteredFoods.length === 0 ? (
                <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No food items found.</td>
                </tr>
              ) : (
                filteredFoods.map((food) => (
                  <tr key={food._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden relative shadow-sm shrink-0">
                            {food.image ? (
                              <img src={food.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-red-50 flex items-center justify-center text-red-400 font-bold text-xs">FOOD</div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 flex items-center gap-2">
                               {food.name}
                               {food.isVeg && <span className="w-2 h-2 rounded-full bg-emerald-500" title="Veg" />}
                            </p>
                            {food.isBestSeller && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-black uppercase">Bestseller</span>}
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-600">
                       {food.restaurant?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-black uppercase tracking-wide">
                          {food.category?.name || food.category}
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-black text-gray-800">
                       Rs. {food.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                       <div className="flex items-center justify-end gap-2">
                          <Link href={`/food/edit/${food._id}`}>
                            <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                               <Edit className="w-4 h-4" />
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleDelete(food._id)}
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
      </div>
    </div>
  );
}