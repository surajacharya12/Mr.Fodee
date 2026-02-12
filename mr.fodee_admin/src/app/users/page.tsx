"use client";

import React, { useEffect, useState } from "react";
import { userApi } from "@/lib/api";
import { Search, MoreHorizontal, Trash2, Shield } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await userApi.getAll();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(search.toLowerCase()) || 
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await userApi.delete(userId);
      setUsers(users.filter(u => u._id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-gray-800">Users</h1>
           <p className="text-gray-500 font-medium">Manage your platform's user base.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#EE4444]/20 focus:border-[#EE4444] transition-all"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold uppercase">
                           {user.profilePictureUrl ? (
                             <img src={user.profilePictureUrl} alt="" className="w-full h-full rounded-full object-cover" />
                           ) : (
                             user.username?.[0] || "U"
                           )}
                         </div>
                         <div>
                           <p className="font-bold text-gray-800">{user.username}</p>
                           <p className="text-xs text-gray-400">{user.email}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold inline-flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        User
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-2" />
                       <span className="text-sm font-bold text-gray-600">Active</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                         <button 
                           onClick={() => handleDelete(user._id)}
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
        
        {!loading && filteredUsers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/30 text-xs font-bold text-gray-400 text-right">
             Showing {filteredUsers.length} users
          </div>
        )}
      </div>
    </div>
  );
}
