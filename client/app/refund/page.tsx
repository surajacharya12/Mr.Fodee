"use client";

import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 md:px-0 py-20">
          <h1 className="text-4xl md:text-5xl font-black text-[#2D2D2D] mb-12">Refund Policy</h1>
          
          <div className="prose prose-lg text-gray-500 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">1. Eligibility for Refunds</h2>
              <p>
                Refunds may be issued in cases where an order is not delivered, incorrect items are received, or there are significant quality issues reported within 15 minutes of delivery.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">2. Non-Refundable Situations</h2>
              <p>
                Refunds will not be issued for orders where the delivery address provided was incorrect, the customer was unreachable by the rider, or for minor delays within 15 minutes of the estimated time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">3. Processing Time</h2>
              <p>
                Approved refunds are typically processed within 3-5 business days. The time it takes for the funds to appear in your account depends on your payment provider.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">4. Method of Refund</h2>
              <p>
                Refunds are generally issued back to the original payment method used at the time of purchase. In some cases, we may offer 'Fodee Credits' as an alternative.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
