"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Search,
  Bell,
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
  User,
  ClipboardList,
  Heart,
  Settings,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "@/context/LocationContext";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const { address: location, isLoading: isLoadingLocation } = useLocation();

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.username) return "U";
    const names = user.username.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.username.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Left: Logo & Location */}
          <div className="flex items-center gap-4 md:gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 group cursor-pointer"
            >
              <img
                src="/assets/logo.png"
                alt="Mr Fodee Logo"
                className="w-10 h-10 rounded-full group-hover:ring-2 group-hover:ring-[primary] transition-all"
              />
              <h1 className="text-xl font-bold text-gray-800 tracking-tight group-hover:text-[primary] transition-colors">
                Mr.Fodee
              </h1>
            </Link>

            <div className="hidden sm:flex items-center gap-2 cursor-pointer group hover:bg-orange-50/50 p-2 rounded-xl transition-all">
              <div
                className={`p-2 rounded-full transition-all ${isLoadingLocation ? "bg-orange-100" : "bg-orange-50 group-hover:bg-[primary]"}`}
              >
                {isLoadingLocation ? (
                  <Loader2 className="w-4 h-4 text-[primary] animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4 text-[primary] group-hover:text-white" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-gray-400 font-bold leading-none tracking-wider">
                  Deliver To
                </span>
                <div className="flex items-center gap-1 min-w-[80px]">
                  {isLoadingLocation ? (
                    <div className="h-4 w-20 bg-gray-100 animate-pulse rounded mt-1"></div>
                  ) : (
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-[primary] line-clamp-1">
                      {location}
                    </span>
                  )}
                  <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-[primary]" />
                </div>
              </div>
            </div>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-md relative mx-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-100 border-none rounded-full py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-[primary] focus:bg-white outline-none transition-all"
            />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <ul className="hidden xl:flex items-center gap-6 text-sm font-semibold text-gray-600">
              <li>
                <Link
                  href="/"
                  className="hover:text-[primary] transition-colors flex items-center gap-1"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="hover:text-[primary] transition-colors"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  href="/favorites"
                  className="hover:text-[primary] transition-colors"
                >
                  Favorites
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="hover:text-[primary] transition-colors"
                >
                  Orders
                </Link>
              </li>
            </ul>

            <div className="flex items-center gap-2">
              <Link
                href="/notifications"
                className="relative p-2.5 sm:p-2 hover:bg-orange-50 rounded-full cursor-pointer group transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600 group-hover:text-[primary]" />
                <span className="absolute top-1.5 right-1.5 bg-[primary] text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full border-2 border-white font-bold">
                  2
                </span>
              </Link>

              <Link
                href="/cart"
                className="relative p-2.5 sm:p-2 hover:bg-orange-50 rounded-full cursor-pointer group transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-[primary]" />
                <span className="absolute top-1.5 right-1.5 bg-[primary] text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full border-2 border-white font-bold">
                  2
                </span>
              </Link>

              {/* Desktop Profile / Login */}
              {isLoggedIn ? (
                <Link
                  href="/profile"
                  className="hidden md:flex ml-2 w-10 h-10 bg-linear-to-br from-[primary] to-[accent] rounded-full items-center justify-center shadow-lg shadow-orange-200 cursor-pointer overflow-hidden border-2 border-white hover:scale-105 transition-transform"
                >
                  {user?.profilePictureUrl ? (
                    <img src={user.profilePictureUrl} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-bold text-sm">{getUserInitials()}</span>
                  )}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:flex ml-2 px-6 py-2 bg-[primary] text-white rounded-full font-bold text-sm hover:bg-[#E64500] transition-all shadow-lg shadow-orange-100 items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <div
                className="md:hidden p-2 hover:bg-orange-50 rounded-full cursor-pointer group transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6 text-gray-600 group-hover:text-[primary]" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MOBILE MENU DRAWER --- */}
      <div
        className={`fixed inset-0 z-100 transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 visible pointer-events-auto"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 transform ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/logo.png"
                  className="w-8 h-8 rounded-full"
                  alt=""
                />
                <span className="font-bold text-gray-800">Mr Fodee</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {isLoggedIn ? (
              <Link
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-14 h-14 bg-linear-to-br from-[primary] to-[accent] rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md shadow-orange-100 overflow-hidden">
                  {user?.profilePictureUrl ? (
                    <img src={user.profilePictureUrl} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    getUserInitials()
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{user?.username || "User"}</h2>
                  <p className="text-sm text-gray-500">{user?.email || ""}</p>
                </div>
              </Link>
            ) : (
              <div className="mb-8 p-4 bg-orange-50 rounded-2xl border border-orange-100 text-center">
                <p className="text-sm text-gray-600 mb-4 font-medium">
                  Welcome to Mr Fodee! Log in to track orders and save your
                  favorites.
                </p>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full py-3 bg-[primary] text-white font-bold rounded-xl shadow-lg shadow-orange-200 active:scale-[0.98] transition-all"
                >
                  Sign In / Sign Up
                </Link>
              </div>
            )}

            <div className="bg-orange-50 p-4 rounded-xl mb-6 flex items-center justify-between border border-orange-100 group cursor-pointer active:scale-[0.98] transition-all">
              <div className="flex items-center gap-3">
                <MapPin
                  className={`text-[primary] w-5 h-5 ${isLoadingLocation ? "animate-bounce" : ""}`}
                />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-[primary]/70">
                    Delivering To
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {isLoadingLocation ? "Detecting..." : location}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[primary]" />
            </div>

            <div className="flex-1 space-y-1 overflow-y-auto">
              <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                <ProfileItem icon={<User size={20} />} label="My Profile" />
              </Link>
              <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)}>
                <ProfileItem
                  icon={<ClipboardList size={20} />}
                  label="My Orders"
                  badge="2"
                />
              </Link>
              <Link
                href="/favorites"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ProfileItem icon={<Heart size={20} />} label="Favorites" />
              </Link>
              <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                <ProfileItem
                  icon={<ShoppingCart size={20} />}
                  label="Cart"
                  badge="3"
                />
              </Link>
              <Link
                href="/notifications"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ProfileItem
                  icon={<Bell size={20} />}
                  label="Notifications"
                  badge="2"
                />
              </Link>
              <hr className="my-4 border-gray-100" />
              <div className="px-2 pb-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Support
                </p>
                <Link href="/help" onClick={() => setIsMobileMenuOpen(false)}>
                  <ProfileItem
                    icon={<Settings size={20} />}
                    label="Help Center"
                  />
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ProfileItem icon={<Settings size={20} />} label="Settings" />
                </Link>
              </div>
            </div>

            {isLoggedIn && (
              <div className="mt-auto py-4 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function ProfileItem({
  icon,
  label,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-orange-50 cursor-pointer group transition-all">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg shadow-sm group-hover:text-[primary] transition-colors">
          {icon}
        </div>
        <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
          {label}
        </span>
      </div>
      {badge && (
        <span className="text-[10px] w-5 h-5 flex items-center justify-center bg-[primary] text-white rounded-full font-bold">
          {badge}
        </span>
      )}
    </div>
  );
}
