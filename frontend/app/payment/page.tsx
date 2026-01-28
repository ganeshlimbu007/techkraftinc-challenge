import { LoadingSpinner } from "@/src/components/loader";
import PaymentLayout from "@/src/layout/payment";
import { Suspense } from "react";

export default function Payment() {
  return (
    <main className="min-h-screen bg-zinc-50 flex flex-col gap-4 items-center justify-center p-6">
      <Suspense fallback={<LoadingSpinner size={40} />}>
        <PaymentLayout />
      </Suspense>
    </main>
  );
}
