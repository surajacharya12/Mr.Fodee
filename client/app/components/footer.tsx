import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <img
                src="/assets/logo.png"
                alt="Mr Fodee Logo"
                className="w-20 h-20 rounded-full"
              />
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                Mr.Fodee
              </h1>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Bringing the best flavors from top restaurants straight to your
              doorstep. Fast, fresh, and reliable.
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#EE4444] hover:text-white transition-all shadow-sm"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-[#2D2D2D] mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {[
                { name: "About Us", href: "/about" },
                { name: "Our Menu", href: "/menu" },
                { name: "Restaurants", href: "/restaurants" },
                { name: "Latest Offers", href: "/offers" },
                { name: "Join as Partner", href: "/partner" },
                { name: "Settings", href: "/settings" },
                { name: "Profile", href: "/profile" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-[#EE4444] transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#EE4444] transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold text-[#2D2D2D] mb-6">Support</h3>
            <ul className="space-y-4">
              {[
                { name: "Help Center", href: "/help" },
                { name: "Safety & Privacy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Refund Policy", href: "/refund" },
                { name: "Contact Us", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-[#EE4444] transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#EE4444] transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-[#2D2D2D] mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#EE4444] shrink-0 mt-0.5" />
                <span className="text-gray-500 text-sm">
                  123 Foodie Street, Kathmandu Metropolitan City, NP
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#EE4444] shrink-0" />
                <span className="text-gray-500 text-sm">+977 1-2345678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#EE4444] shrink-0" />
                <span className="text-gray-500 text-sm">hello@mrfodee.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs text-center md:text-left">
            &copy; {new Date().getFullYear()} Mr Fodee. All rights reserved.
          </p>
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <a href="#" className="hover:text-gray-600 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-600 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-gray-600 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
