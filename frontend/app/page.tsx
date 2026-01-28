import TicketsLayoutPage from "@/src/layout/tickets";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans ">
      <TicketsLayoutPage />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#18181b",
            color: "#fff",
          },
        }}
      />
    </div>
  );
}
