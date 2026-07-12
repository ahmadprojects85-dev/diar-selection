"use client"; // Error components must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { ServerCrash, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-bg-elevated border border-border rounded-xl shadow-2xl p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
          <ServerCrash className="w-8 h-8 text-red-500" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold text-text-primary">
            Server is Waking Up
          </h2>
          <p className="text-text-secondary text-sm">
            Our secure database was resting. It takes a few seconds to wake up for the first visitor. Please refresh the page to continue.
          </p>
        </div>

        <button
          onClick={() => reset()}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold hover:bg-gold/90 text-bg-main font-semibold rounded-lg transition-colors"
        >
          <RefreshCw size={18} />
          Refresh Page
        </button>

        <div className="pt-4 border-t border-border">
          <Link href="/" className="text-sm text-text-muted hover:text-gold transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
