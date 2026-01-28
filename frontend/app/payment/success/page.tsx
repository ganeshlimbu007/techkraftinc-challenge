"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function BookingSuccessPage() {
  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div
        className="
          w-full max-w-md bg-white rounded-2xl border shadow-lg
          p-8 text-center
          animate-in fade-in slide-in-from-bottom-3 duration-300
        "
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-14 h-14 text-green-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">
          Payment Successful
        </h1>

        {/* Message */}
        <p className="text-zinc-600 mb-6">
          Your tickets have been successfully booked.
          <br />A confirmation has been recorded.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="
              inline-flex justify-center items-center
              rounded-full bg-black text-white
              px-6 py-3 font-medium
              transition transform-gpu
              hover:scale-[1.03] hover:shadow-lg
              active:scale-[0.97]
            "
          >
            Book More Tickets
          </Link>
        </div>
      </div>
    </main>
  );
}
