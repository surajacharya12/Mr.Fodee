"use client";

import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function LegalPage({ title = "Safety & Privacy" }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 md:px-0 py-20">
          <h1 className="text-4xl md:text-5xl font-black text-[#2D2D2D] mb-12">{title}</h1>
          
          <div className="prose prose-lg text-gray-500 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">1. Data Collection</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, place an order, or contact us for support. This includes your name, email, phone number, and delivery address.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">2. Use of Information</h2>
              <p>
                The information we collect is used to provide, maintain, and improve our services, including processing orders and sending notifications about your delivery status.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">3. Data Sharing</h2>
              <p>
                We share your information with our restaurant partners and delivery riders only to the extent necessary to fulfill your orders. We do not sell your personal data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">4. Security</h2>
              <p>
                We take reasonable measures to protect your personal information from loss, theft, misuse, and unauthorized access. All payment transactions are encrypted.
              </p>
            </section>

            <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h2 className="text-xl font-bold text-[#2D2D2D] mb-4 italic">Last Updated</h2>
              <p className="text-sm">This policy was last updated on February 10, 2026. Continued use of our platform constitutes acceptance of these terms.</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
