"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { 
  ChevronLeft, 
  Lock, 
  Globe, 
  Moon, 
  Trash2, 
  Shield, 
  Bell, 
  Eye, 
  Database, 
  ChevronRight,
  Info,
  Smartphone,
  Check
} from "lucide-react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function SettingsPage() {
  const router = useRouter();
  
  // Settings state with initialization
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [activeLang, setActiveLang] = useState("English (US)");
  const [notifSounds, setNotifSounds] = useState(true);
  const [downloading, setDownloading] = useState(false);
  
  const languages = ["English (US)", "Nepali", "Hindi", "Spanish"];

  // Initialize settings from localStorage on mount
  useEffect(() => {
    // Dark Mode
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    }

    // Language
    const savedLang = localStorage.getItem("appLanguage");
    if (savedLang) setActiveLang(savedLang);

    // Notifications
    const savedNotif = localStorage.getItem("notifSounds");
    if (savedNotif) setNotifSounds(savedNotif === "true");
  }, []);

  // Handlers
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", String(newMode));
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const setLanguage = (lang: string) => {
    setActiveLang(lang);
    localStorage.setItem("appLanguage", lang);
  };

  const toggleNotifSounds = () => {
    const newState = !notifSounds;
    setNotifSounds(newState);
    localStorage.setItem("notifSounds", String(newState));
  };

  const handleDownload = () => {
    setDownloading(true);
    
    // Simulate data fetch delay then generate PDF
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : { username: "Guest", email: "guest@example.com" };
        
        // Title
        doc.setFontSize(22);
        doc.text("Mr. Fodee", 20, 20);
        doc.setFontSize(16);
        doc.text("User Data Export", 20, 30);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 36);
        
        // User Profile Section
        doc.setFontSize(14);
        doc.text("Profile Information", 20, 50);
        
        autoTable(doc, {
          startY: 55,
          head: [['Field', 'Value']],
          body: [
            ['Username', user.username || user.name || "N/A"],
            ['Email', user.email || "N/A"],
            ['Phone', user.phoneNumber || user.phone || "N/A"],
            ['User ID', user.id || user._id || "N/A"],
            ['Joined', user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"],
          ],
        });
        
        // Settings Section
        const finalY = (doc as any).lastAutoTable.finalY || 100;
        doc.text("App Settings", 20, finalY + 15);
        
        autoTable(doc, {
          startY: finalY + 20,
          head: [['Setting', 'Value']],
          body: [
            ['App Language', activeLang],
            ['Dark Mode', darkMode ? "Enabled" : "Disabled"],
            ['Notification Sounds', notifSounds ? "On" : "Off"],
            ['Two-Factor Auth', twoFactor ? "Enabled" : "Disabled"],
          ],
        });

        // Save PDF
        doc.save("mr-fodee-user-data.pdf");
        
        alert("Your data has been downloaded successfully!");
      } catch (error) {
        console.error("PDF Generation Error:", error);
        alert("Failed to generate PDF report.");
      } finally {
        setDownloading(false);
      }
    }, 1500);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-[#FAFAFA]'}`}>
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-[#EE4444] font-bold mb-8 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Profile
          </button>

          <h1 className={`text-4xl font-black mb-12 ${darkMode ? 'text-white' : 'text-[#2D2D2D]'}`}>Settings</h1>

          <div className="space-y-10">
            {/* Account Security */}
            <section>
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-6">Account Security</h2>
              <div className={`rounded-4xl border shadow-sm overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <SettingsToggle 
                  icon={<Shield className="w-5 h-5" />} 
                  label="Two-Factor Authentication" 
                  description="Add an extra layer of security to your account"
                  active={twoFactor}
                  onToggle={() => setTwoFactor(!twoFactor)}
                  darkMode={darkMode}
                />
                <SettingsLink
                  icon={<Lock className="w-5 h-5" />}
                  label="Change Password"
                  description="Update your password regularly for better safety"
                  href="/settings/password"
                  darkMode={darkMode}
                />
                <SettingsLink
                  icon={<Smartphone className="w-5 h-5" />}
                  label="Logged-in Devices"
                  description="Manage and logout from other active sessions"
                  href="/settings/devices"
                  isLast
                  darkMode={darkMode}
                />
              </div>
            </section>

            {/* General Preferences */}
            <section>
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-6">Preferences</h2>
              <div className={`rounded-4xl border shadow-sm overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-50'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-400'}`}>
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <p className={`font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>App Language</p>
                        <p className="text-xs text-gray-400 font-medium">Choose your preferred language</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 px-2">
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                          activeLang === lang
                            ? "bg-[#EE4444] text-white shadow-lg shadow-red-500/20"
                            : darkMode ? "bg-gray-700 text-gray-400 hover:bg-gray-600" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        {activeLang === lang && <Check className="w-3 h-3" />}
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <SettingsToggle
                  icon={<Moon className="w-5 h-5" />}
                  label="Dark Mode"
                  description="Switch between light and dark themes"
                  active={darkMode}
                  onToggle={toggleDarkMode}
                  darkMode={darkMode}
                />

                <SettingsToggle 
                  icon={<Bell className="w-5 h-5" />} 
                  label="Notification Sounds" 
                  description="Pick your favorite alert tones"
                  active={notifSounds}
                  onToggle={toggleNotifSounds}
                  isLast
                  darkMode={darkMode}
                />
              </div>
            </section>

            {/* Data & Privacy */}
            <section>
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-6">Data & Privacy</h2>
              <div className={`rounded-4xl border shadow-sm overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <SettingsLink
                  icon={<Eye className="w-5 h-5" />}
                  label="Profile Visibility"
                  description="Control who can see your reviews and favorites"
                  href="/settings/data"
                  darkMode={darkMode}
                />
                <div 
                  onClick={handleDownload}
                  className={`p-6 flex items-center justify-between hover:bg-opacity-50 cursor-pointer group transition-all rounded-b-4xl ${downloading ? 'pointer-events-none opacity-50' : ''} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors group-hover:text-[#EE4444] group-hover:bg-red-50 ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-400'}`}>
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={`font-bold transition-colors group-hover:text-gray-900 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        {downloading ? 'Preparing Archive...' : 'Download My Data'}
                      </p>
                      <p className="text-xs text-gray-400 font-medium">Get a copy of all your Fodee account information</p>
                    </div>
                  </div>
                  {downloading ? (
                    <div className="w-5 h-5 border-2 border-[#EE4444] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#EE4444] group-hover:translate-x-1 transition-all" />
                  )}
                </div>
              </div>
            </section>

            {/* Danger Zone */}
            <section>
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-6">Danger Zone</h2>
              <div className={`rounded-4xl border border-red-50 shadow-sm overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div
                  onClick={() => router.push("/settings/delete")}
                  className={`p-6 flex items-center justify-between cursor-pointer group transition-all ${darkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50/30'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-400 flex items-center justify-center transition-colors group-hover:bg-red-100">
                      <Trash2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-red-500">Delete Account</p>
                      <p className="text-xs text-red-400 font-medium">Permanently remove all your data and access</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-red-200 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </section>

            {/* App Info */}
            <div className="text-center py-10">
              <div className="flex items-center justify-center gap-2 text-gray-300 mb-2">
                <Info className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Mr. Fodee v1.0.0</span>
              </div>
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Made with ❤️ for food lovers</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function SettingsLink({ icon, label, description, href, isLast = false, darkMode = false }: { 
  icon: React.ReactNode, 
  label: string, 
  description: string,
  href?: string,
  isLast?: boolean,
  darkMode?: boolean
}) {
  const router = useRouter();
  
  return (
    <div 
      onClick={() => href && router.push(href)}
      className={`p-6 flex items-center justify-between cursor-pointer group transition-all ${!isLast ? (darkMode ? 'border-b border-gray-700' : 'border-b border-gray-50') : ''} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50/50'}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors group-hover:text-[#EE4444] group-hover:bg-red-50 ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-400'}`}>
          {icon}
        </div>
        <div>
          <p className={`font-bold transition-colors group-hover:text-gray-900 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{label}</p>
          <p className="text-xs text-gray-400 font-medium">{description}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#EE4444] group-hover:translate-x-1 transition-all" />
    </div>
  );
}

function SettingsToggle({ icon, label, description, active, onToggle, isLast = false, darkMode = false }: { 
  icon: React.ReactNode, 
  label: string, 
  description: string,
  active: boolean,
  onToggle: () => void,
  isLast?: boolean,
  darkMode?: boolean
}) {
  return (
    <div className={`p-6 flex items-center justify-between transition-all ${!isLast ? (darkMode ? 'border-b border-gray-700' : 'border-b border-gray-50') : ''}`}>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${active ? 'bg-red-50 text-[#EE4444]' : (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-400')}`}>
          {icon}
        </div>
        <div>
          <p className={`font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{label}</p>
          <p className="text-xs text-gray-400 font-medium">{description}</p>
        </div>
      </div>
      <div 
        onClick={onToggle}
        className={`relative w-12 h-7 rounded-full transition-all duration-300 cursor-pointer ${active ? 'bg-[#EE4444] shadow-lg shadow-red-500/20' : (darkMode ? 'bg-gray-600' : 'bg-gray-200')}`}
      >
        <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 transform ${active ? 'translate-x-5' : 'translate-x-0'}`}>
          {active && <Check className="w-3 h-3 text-[#EE4444] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
        </div>
      </div>
    </div>
  );
}
