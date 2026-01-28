"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PaymentService } from "../features/payment/payment.service";
import ErrorComponent from "../components/error";

const RESERVATION_TTL_SECONDS = 120; // 2 minutes

export default function PaymentLayout() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [secondsLeft, setSecondsLeft] = useState(RESERVATION_TTL_SECONDS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [card, setCard] = useState("");

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await PaymentService.confirmPayment({
        reservationToken: token ?? "",
        card,
      });

      router.push("/bookings/success");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <main className="min-h-screen bg-zinc-50 flex flex-col gap-4 items-center justify-center p-6">
      <div className="w-full   max-w-md bg-white rounded-xl shadow-lg border p-6 space-y-6">
        <h1 className="text-xl font-semibold text-zinc-900">
          Complete Payment
        </h1>

        {/* Expiry Warning */}
        <div
          className={`rounded-lg p-3 text-sm font-medium ${
            secondsLeft <= 30
              ? "bg-red-50 text-red-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          Reservation expires in{" "}
          <span className="font-bold">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>

        {/* Fake Card Form */}
        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-600 mb-1">
              Card Number
            </label>
            <input
              required
              placeholder="4242 4242 4242 4242"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black/80  placeholder:text-black/30"
              name="card"
              onChange={(e) => setCard(e.target?.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading || secondsLeft <= 0 || card.trim().length === 0}
            className={`
              w-full py-3 rounded-lg font-medium transition
              ${
                loading || secondsLeft <= 0
                  ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                  : "bg-black text-white hover:scale-[1.02] active:scale-[0.98]"
              }
            `}
            onClick={handlePay}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>

        <p className="text-xs text-zinc-400 text-center">
          This is a demo payment.
        </p>
      </div>

      <ErrorComponent error={error} />
    </main>
  );
}
