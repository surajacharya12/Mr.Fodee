"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { ChevronLeft, Smartphone, Monitor, Globe, LogOut, Shield, Laptop } from "lucide-react";
import { useRouter } from "next/navigation";

type Device = {
  id: number;
  name: string;
  location: string;
  time: string;
  icon: any;
  isCurrent: boolean;
  color: string;
};

export default function LoggedInDevicesPage() {
  const router = useRouter();
  const [currentDevice, setCurrentDevice] = useState<Device | null>(null);

  // Parse User Agent to get device details
  useEffect(() => {
    const ua = navigator.userAgent;
    let browser = "Unknown Browser";
    let os = "Unknown OS";
    let deviceType = "Desktop";
    let Icon = Monitor;

    // Detect Browser
    if (ua.indexOf("Firefox") > -1) browser = "Firefox";
    else if (ua.indexOf("SamsungBrowser") > -1) browser = "Samsung Internet";
    else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browser = "Opera";
    else if (ua.indexOf("Trident") > -1) browser = "Internet Explorer";
    else if (ua.indexOf("Edge") > -1) browser = "Edge";
    else if (ua.indexOf("Chrome") > -1) browser = "Chrome";
    else if (ua.indexOf("Safari") > -1) browser = "Safari";

    // Detect OS
    if (ua.indexOf("Win") !== -1) os = "Windows";
    else if (ua.indexOf("Mac") !== -1) os = "macOS";
    else if (ua.indexOf("Linux") !== -1) os = "Linux";
    else if (ua.indexOf("Android") !== -1) { os = "Android"; deviceType = "Mobile"; Icon = Smartphone; }
    else if (ua.indexOf("like Mac") !== -1) { os = "iOS"; deviceType = "Mobile"; Icon = Smartphone; }

    setCurrentDevice({
      id: 1,
      name: `${browser} on ${os}`,
      location: "Near You", // In a real app, this would come from IP geolocation
      time: "Active Now",
      icon: Icon,
      isCurrent: true,
      color: "text-emerald-500 bg-emerald-50"
    });
  }, []);

  const otherDevices: Device[] = [
    {
      id: 2,
      name: "Safari on iPhone 12",
      location: "Kathmandu, Nepal",
      time: "Last active: 2 hours ago",
      icon: Smartphone,
      isCurrent: false,
      color: "text-gray-400 bg-gray-50"
    },
    {
      id: 3,
      name: "Chrome on Windows",
      location: "Pokhara, Nepal",
      time: "Last active: 3 days ago",
      icon: Monitor,
      isCurrent: false,
      color: "text-gray-400 bg-gray-50"
    }
  ];

  const allDevices = currentDevice ? [currentDevice, ...otherDevices] : otherDevices;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-[#EE4444] font-bold mb-8 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Settings
          </button>

          <header className="mb-12">
            <h1 className="text-4xl font-black text-[#2D2D2D] mb-4">Logged-in Devices</h1>
            <p className="text-gray-500 text-lg font-medium">Manage and secure your active sessions across all platforms.</p>
          </header>

          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mb-12">
             <div className="divide-y divide-gray-50">
               {allDevices.map((device) => {
                 const Icon = device.icon;
                 return (
                   <div key={device.id} className="p-8 flex items-center justify-between hover:bg-gray-50/30 transition-all group">
                     <div className="flex items-center gap-6">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${device.color} shadow-sm group-hover:scale-110 transition-transform`}>
                          <Icon className="w-7 h-7" />
                       </div>
                       <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-black text-[#2D2D2D]">{device.name}</h3>
                            {device.isCurrent && (
                              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">This Device</span>
                            )}
                          </div>
                          <p className="text-gray-400 font-bold text-sm">{device.location} • <span className={device.isCurrent ? 'text-emerald-500' : ''}>{device.time}</span></p>
                       </div>
                     </div>
  
                     {!device.isCurrent && (
                       <button className="h-10 px-6 rounded-xl border border-gray-100 text-gray-400 font-bold text-xs hover:border-red-100 hover:text-red-500 transition-all flex items-center gap-2 group/btn">
                          <LogOut className="w-4 h-4" />
                          Logout
                       </button>
                     )}
                   </div>
                 );
               })}
             </div>
          </div>

          <div className="bg-[#2D2D2D] rounded-[2rem] p-8 text-white relative overflow-hidden group">
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md">
                      <Shield className="w-6 h-6 text-[#EE4444]" />
                   </div>
                   <div>
                      <p className="font-black text-lg">Unrecognized Session?</p>
                      <p className="text-white/40 text-sm font-medium">If you don't recognize a device, logout immediately.</p>
                   </div>
                </div>
                <button className="h-12 px-8 bg-[#EE4444] text-white rounded-xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-red-500/20 active:scale-[0.98]">
                   Logout from all devices
                </button>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[60px] -mr-32 -mt-32" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
