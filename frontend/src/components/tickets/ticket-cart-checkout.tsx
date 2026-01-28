"use client";

import { ShoppingCart } from "lucide-react";

interface Props {
  count: number;
}

export function CheckoutButton({ count }: Props) {
  const disabled = count === 0;

  const onClick = () => {};

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        ml-auto flex items-center gap-3
        px-6 py-3 rounded-full font-medium
        transition-all duration-200
        transform-gpu

        ${
          disabled
            ? "  text-zinc-400   cursor-not-allowed"
            : "  text-black   hover:scale-[1.03] hover:shadow-lg active:scale-[0.97]"
        }
      `}
    >
      {/* Cart Icon */}
      <div className="relative">
        <ShoppingCart className="w-5 h-5" />

        {/* Count Badge */}
        {count > 0 && (
          <span
            className="
              absolute -top-2 -right-2
              min-w-[20px]   px-1
              rounded-full bg-red-500 text-white
              text-xs font-semibold
              flex items-center justify-center
              animate-bounce-subtle
            "
          >
            {count}
          </span>
        )}
      </div>
    </button>
  );
}
