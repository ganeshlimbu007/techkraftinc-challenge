"use client";

import { ReservationService } from "@/src/features/bookings/booking.service";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../loader";
import toast from "react-hot-toast";
interface Props {
  ids: string[];
}

export function CheckoutButton({ ids }: Props) {
  const router = useRouter();
  const disabled = ids.length === 0;
  const [reserveError, setReserveError] = useState("");
  const [reserveLoading, setReserveLoading] = useState(false);

  const onClick = async () => {
    setReserveError("");
    setReserveLoading(true);
    console.log("selected ids", ids);
    try {
      const result = await ReservationService.create([...ids]);

      // Success → redirect to payment page
      router.push(`/payment?token=${result.reservationToken}`);
    } catch (err: unknown) {
      if (err instanceof Error)
        setReserveError(err.message || "Failed to reserve tickets");
    } finally {
      setReserveLoading(false);
    }
  };

  useEffect(() => {
    if (!!reserveError.trim().length) {
      toast.error(reserveError);
      setReserveError("");
    }
  }, [reserveError]);

  return (
    <button
      disabled={reserveLoading}
      onClick={onClick}
      className={`
        ml-auto flex items-center gap-3
        px-6 py-3 rounded-full font-medium
        transition-all duration-200
        transform-gpu
        cursor-pointer
        ${
          disabled
            ? "  text-zinc-400   cursor-not-allowed"
            : "  text-black   hover:scale-[1.03] hover:shadow-lg active:scale-[0.97]"
        }
      `}
    >
      {/* Cart Icon */}
      <div className="relative">
        {reserveLoading ? (
          <LoadingSpinner />
        ) : (
          <ShoppingCart className="w-5 h-5" />
        )}
        {/* Count Badge */}
        {ids.length > 0 && (
          <span
            className="
              absolute -top-2 -right-2
              min-w-5  px-1
              rounded-full bg-red-500 text-white
              text-xs font-semibold
              flex items-center justify-center
              animate-bounce-subtle
            "
          >
            {ids.length}
          </span>
        )}
      </div>
    </button>
  );
}
