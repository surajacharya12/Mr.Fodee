"use client";

import React from "react";
import { Settings, Bell, Lock } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-800">Settings</h1>
        <p className="text-gray-500 font-medium">Configure admin panel preferences.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
           <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
             <Bell className="w-5 h-5 text-[#EE4444]" />
             Notifications
           </h2>
           <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                 <span className="text-gray-600 font-medium">New User Alerts</span>
                 <input type="checkbox" className="toggle" defaultChecked />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                 <span className="text-gray-600 font-medium">Order Notifications</span>
                 <input type="checkbox" className="toggle" defaultChecked />
              </label>
           </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
           <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
             <Lock className="w-5 h-5 text-blue-500" />
             Security
           </h2>
           <button className="w-full h-12 bg-gray-50 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-colors">
              Change Admin Password
           </button>
        </div>
      </div>
    </div>
  );
}
