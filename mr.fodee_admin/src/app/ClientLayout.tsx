"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Tag, 
  Settings, 
  LogOut,
  Menu,
  Pizza,
  Grid2X2
} from "lucide-react";
import toast from "react-hot-toast";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Users, label: "Users", href: "/users" },
    { icon: Store, label: "Restaurants", href: "/restaurants" },
    { icon: Tag, label: "Offers", href: "/offers" },
    { icon: Grid2X2, label: "Categories", href: "/categories" },
    { icon: Pizza, label: "Food Items", href: "/food" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const isLoginPage = pathname === "/login";

  const [adminEmail, setAdminEmail] = React.useState("Admin");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Auth Protection
  React.useEffect(() => {
    if (!mounted) return;
    
    // Allow public access to login page
    if (pathname === "/login") return;

    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      router.push("/login"); // Redirect to login
    } else {
      const userStr = localStorage.getItem("adminUser");
      if (userStr) {
        try {
           setAdminEmail(JSON.parse(userStr).email || "Admin");
        } catch (e) {
           console.error("Failed to parse admin user", e);
        }
      }
    }
  }, [router, pathname, mounted]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  // Prevent flash of unstyled content or redirects
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50" />
    );
  }

  return (
    <>
      {isLoginPage ? (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            {children}
          </div>
      ) : (
        <div className="min-h-screen bg-gray-50 flex">
          {/* Sidebar - Desktop */}
          <aside className="w-64 bg-[#1E1E1E] text-white hidden md:flex flex-col fixed h-full inset-y-0 z-50">
            <div className="p-8">
              <h1 className="text-2xl font-black tracking-tighter text-[#EE4444]">Fodee<span className="text-white">Admin</span></h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      isActive 
                        ? "bg-[#EE4444] text-white shadow-lg shadow-red-500/20" 
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 mt-auto">
              <div className="px-4 py-2 mb-2">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Active Admin</p>
                <p className="text-sm font-bold text-white truncate">
                  {adminEmail}
                </p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 md:ml-64 transition-all w-full">
            {/* Mobile Header */}
            <div className="md:hidden bg-[#1E1E1E] text-white p-4 flex justify-between items-center sticky top-0 z-40">
                <h1 className="font-black text-[#EE4444]">Fodee Admin</h1>
                <Menu className="w-6 h-6" />
            </div>

            <main className="p-6 md:p-10">
              {children}
            </main>
          </div>
        </div>
      )}
    </>
  );
}
