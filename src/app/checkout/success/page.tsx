"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") || "N/A";
  const [markedPaid, setMarkedPaid] = useState(false);

  // When the customer lands on this page after a successful Wayl payment redirect,
  // immediately mark the order as PAID in our database (as a reliable fallback
  // in case the Wayl webhook fails or is delayed).
  useEffect(() => {
    if (ref && ref !== "N/A" && !markedPaid) {
      fetch("/api/checkout/wayl/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceId: ref }),
      })
        .then((res) => res.json())
        .then(() => setMarkedPaid(true))
        .catch((err) => console.error("Failed to confirm order:", err));
    }
  }, [ref, markedPaid]);

  return (
    <div className="max-w-md w-full bg-[#18130F] border border-white/5 p-8 rounded-3xl text-center shadow-2xl space-y-6">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-[#d49f37]/20 blur-xl rounded-full" />
          <div className="relative w-16 h-16 bg-[#d49f37]/10 text-[#d49f37] rounded-full flex items-center justify-center border border-[#d49f37]/20">
            <CheckCircle2 size={32} />
          </div>
        </div>
      </div>

      {/* Heading */}
      <div className="space-y-2">
        <h1 className="font-serif text-3xl font-bold text-white tracking-wide">
          Payment Successful
        </h1>
        <p className="text-[#EBE5DB]/70 text-sm">
          Thank you for choosing Diar Selection. Your premium coffee gear is on its way.
        </p>
      </div>

      {/* Transaction Details */}
      <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-2 text-left">
        <div className="flex justify-between text-xs">
          <span className="text-white/40 uppercase tracking-wider">Status</span>
          <span className="text-[#d49f37] font-bold uppercase tracking-wider">Paid</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-white/40 uppercase tracking-wider">Order Reference</span>
          <span className="font-mono text-white/80 select-all">{ref}</span>
        </div>
      </div>

      {/* Note */}
      <p className="text-white/40 text-[11px] leading-relaxed">
        A confirmation has been sent to our system. Our team will contact you via phone or WhatsApp shortly to confirm your delivery details.
      </p>

      {/* Back Button */}
      <div className="pt-4">
        <Link
          href="/"
          className="group relative flex items-center justify-center gap-3 w-full h-12 rounded-xl bg-white text-black font-bold uppercase tracking-widest text-xs overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(212,162,76,0.15)]"
        >
          <div className="absolute inset-0 bg-[#d49f37] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          <span className="relative z-10 group-hover:text-white transition-colors duration-300">Return to Storefront</span>
          <ArrowRight size={14} className="relative z-10 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Premium background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] aspect-square bg-[#d49f37]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] aspect-square bg-[#d49f37]/5 blur-[120px] rounded-full pointer-events-none" />

      <Suspense fallback={
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-[#d49f37] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/50 text-sm">Verifying your payment details...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
