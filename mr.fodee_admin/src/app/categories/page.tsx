"use client";

import React, { useEffect, useState } from "react";
import { categoryApi } from "@/lib/api";
import { Search, Plus, Grid2X2, Trash2, Edit } from "lucide-react";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await categoryApi.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await categoryApi.delete(id);
      setCategories(categories.filter(c => c._id !== id));
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Failed to delete category");
    }
  };

  const filteredCategories = categories.filter(category => 
    category.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-gray-800">Categories</h1>
           <p className="text-gray-500 font-medium">Manage food categories displayed on the home screen.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#EE4444]/20 focus:border-[#EE4444] transition-all"
            />
          </div>
          <Link href="/categories/new">
            <button className="h-12 px-6 bg-[#EE4444] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 active:scale-95">
               <Plus className="w-5 h-5" />
               <span className="hidden md:inline">Add Category</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
           <div className="md:col-span-4 text-center py-20 text-gray-400">Loading categories...</div>
        ) : filteredCategories.length === 0 ? (
           <div className="md:col-span-4 text-center py-20 text-gray-400">No categories found.</div>
        ) : (
          filteredCategories.map((category) => (
            <div key={category._id} className="bg-white rounded-4xl p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all group relative">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Link href={`/categories/edit/${category._id}`}>
                  <button className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-md shadow-md text-gray-400 hover:text-blue-500 transition-colors flex items-center justify-center">
                    <Edit className="w-4 h-4" />
                  </button>
                </Link>
                <button 
                  onClick={(e) => handleDelete(category._id, e)}
                  className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-md shadow-md text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="aspect-square rounded-3xl overflow-hidden bg-gray-50 mb-4">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="text-center">
                <h3 className="text-lg font-black text-gray-800">{category.name}</h3>
                <span className={`text-[10px] font-black uppercase tracking-widest ${category.isActive ? 'text-emerald-500' : 'text-gray-400'}`}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
