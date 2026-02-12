import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LocationProvider } from "@/context/LocationContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Mr Fodee | Delicious Food Delivered Fast",
  description: "Order from 2,000+ restaurants near you with lightning-fast delivery. The best food delivery app in town.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} font-outfit antialiased`}
      >
        <AuthProvider>
          <LocationProvider>
            <Toaster position="top-center" reverseOrder={false} />
            {children}
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
