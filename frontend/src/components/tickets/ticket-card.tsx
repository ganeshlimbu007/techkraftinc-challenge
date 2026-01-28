import { Ticket } from "@/src/data/types/ticket";

interface Props {
  ticket: Ticket;
  selected: boolean;
  onToggle: (ticketId: string) => void;
}

export function TicketCard({ ticket, selected, onToggle }: Props) {
  const isAvailable = ticket.status === "AVAILABLE";

  const borderColor = selected
    ? "border-blue-500"
    : ticket.status === "RESERVED"
      ? "border-amber-400"
      : ticket.status === "SOLD"
        ? "border-red-400"
        : "border-zinc-200";

  const bgColor = selected
    ? "bg-blue-50"
    : ticket.status === "RESERVED"
      ? "bg-amber-50"
      : ticket.status === "SOLD"
        ? "bg-red-50"
        : "bg-white";

  return (
    <div
      onClick={() => isAvailable && onToggle(ticket.id)}
      className={`
        h-full rounded-xl border p-4
        flex flex-col justify-between
        transition-all duration-200 ease-out
        transform-gpu

        ${borderColor}
        ${bgColor}

        ${
          isAvailable
            ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5"
            : "cursor-not-allowed opacity-70"
        }

        ${selected ? "shadow-md scale-[1.02]" : "shadow-sm"}
      `}
    >
      <div>
        <p className="font-semibold text-zinc-900">{ticket.tier}</p>

        <p className="text-sm text-zinc-500">${ticket.price}</p>

        <p className="text-xs text-zinc-400 mt-1">{ticket.id.slice(0, 8)}…</p>
      </div>
    </div>
  );
}
