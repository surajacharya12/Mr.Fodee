"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { paymentApi } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import toast from "react-hot-toast";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );

  const method = searchParams.get("method");
  const orderId = searchParams.get("orderId");
  const data = searchParams.get("data"); // eSewa
  const pidx = searchParams.get("pidx"); // Khalti

  useEffect(() => {
    if (!method || !orderId) {
      setStatus("error");
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        await paymentApi.verify({
          method: method as string,
          orderId: orderId as string,
          data: data || undefined,
          pidx: pidx || undefined,
        });

        setStatus("success");
        await clearCart();
        toast.success("Payment verified successfully!");
      } catch (error) {
        console.error("Verification failed:", error);
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [method, orderId, data, pidx, clearCart]);

  return (
    <div className="max-w-md w-full mx-4 bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100 text-center">
      {loading ? (
        <div className="space-y-6">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mx-auto animate-pulse">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
          <h2 className="text-2xl font-black text-[#2D2D2D]">
            Verifying Payment...
          </h2>
          <p className="text-gray-400 font-bold">
            Please wait while we confirm your transaction.
          </p>
        </div>
      ) : status === "success" ? (
        <div className="space-y-8">
          <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-500 mx-auto shadow-xl shadow-emerald-500/10">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-[#2D2D2D] mb-4">
              Payment Success!
            </h2>
            <p className="text-gray-400 font-bold text-lg leading-relaxed">
              Your payment has been verified. Your order is now{" "}
              <span className="text-[#EE4444]">Confirmed</span>.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => router.push("/orders")}
              className="h-16 rounded-2xl bg-[#EE4444] text-white font-black text-lg hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
            >
              Track Order
            </button>
            <button
              onClick={() => router.push("/")}
              className="h-16 rounded-2xl bg-gray-50 text-gray-800 font-black text-lg hover:bg-gray-100 transition-all border border-gray-100"
            >
              Back Home
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="w-24 h-24 rounded-full bg-red-50 border-4 border-red-100 flex items-center justify-center text-[#EE4444] mx-auto shadow-xl shadow-red-500/10">
            <XCircle className="w-12 h-12" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-[#2D2D2D] mb-4">
              Payment Failed
            </h2>
            <p className="text-gray-400 font-bold text-lg leading-relaxed">
              We couldn't verify your payment. If money was deducted, please
              contact support.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => router.push("/checkout")}
              className="h-16 rounded-2xl bg-[#EE4444] text-white font-black text-lg hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/support")}
              className="h-16 rounded-2xl bg-gray-50 text-gray-800 font-black text-lg hover:bg-gray-100 transition-all border border-gray-100"
            >
              Contact Support
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <main className="pt-32 pb-20 flex items-center justify-center">
        <Suspense
          fallback={
            <div className="max-w-md w-full mx-4 bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100 text-center">
              <div className="space-y-6">
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mx-auto animate-pulse">
                  <Loader2 className="w-10 h-10 animate-spin" />
                </div>
                <h2 className="text-2xl font-black text-[#2D2D2D]">
                  Verifying Payment...
                </h2>
                <p className="text-gray-400 font-bold">
                  Please wait while we confirm your transaction.
                </p>
              </div>
            </div>
          }
        >
          <PaymentSuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );

}