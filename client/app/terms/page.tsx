"use client";

import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 md:px-0 py-20">
          <h1 className="text-4xl md:text-5xl font-black text-[#2D2D2D] mb-12">Terms of Service</h1>
          
          <div className="prose prose-lg text-gray-500 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the Mr Fodee platform, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">2. User Accounts</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account. You must be at least 18 years old to create an account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">3. Ordering & Payments</h2>
              <p>
                All prices listed on the platform are inclusive of taxes where applicable. Delivery fees may apply and will be displayed at checkout. Payment must be made at the time of ordering.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">4. Cancellations</h2>
              <p>
                Orders can only be canceled within 1 minute of placement. Once a restaurant has accepted the order and started preparation, cancellations are not eligible for refunds.
              </p>
            </section>

            <section className="bg-orange-50 p-8 rounded-3xl border border-orange-100">
              <h2 className="text-xl font-bold text-[#2D2D2D] mb-4 italic">Important Note</h2>
              <p className="text-sm">Mr Fodee is a marketplace platform and is not responsible for the quality of food prepared by restaurant partners.</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
