"use client";

import { useEffect, useState } from "react";

import { Ticket } from "../data/types/ticket";
import { TicketsService } from "../features/bookings/ticket.service";
import { TicketList } from "../components/tickets/ticket-list";
import { CheckoutButton } from "../components/tickets/ticket-cart-checkout";
import ErrorComponent from "../components/error";
import { LoadingSpinner } from "../components/loader";
const tabs: string[] = ["ALL", "VIP", "FRONT_ROW", "GA"] as const;
type Tabs = "ALL" | "VIP" | "FRONT_ROW" | "GA";
export default function TicketsLayoutPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState<Tabs>("ALL");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const getTickets = async () => {
    try {
      const tickets = await TicketsService.getAllTickets();
      setTickets(tickets);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getTickets();
  }, []);

  const onToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((existingId) => existingId !== id)
        : [...prev, id],
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4 lg:p-8  ">
      <ul className="flex flex-wrap text-sm font-medium border-b border-zinc-200 ">
        {!loading &&
          tabs.map((tab) => {
            const isActive = tab === selectedTab;

            return (
              <li key={tab} className="me-2">
                <button
                  type="button"
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => {
                    setSelectedTab(tab as Tabs);
                  }}
                  className={`
                inline-block px-4 py-3 rounded-t-lg transition-all duration-200
                cursor-pointer
                ${
                  isActive
                    ? "text-blue-600 bg-white border border-b-transparent border-zinc-200 shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                }
              `}
                >
                  {tab.replace("_", " ")}
                </button>
              </li>
            );
          })}

        <CheckoutButton ids={selectedIds} />
      </ul>

      <TicketList
        tickets={tickets
          .sort((a, b) => a.id.localeCompare(b.id))
          .filter((ticket) =>
            selectedTab === tabs[0] ? ticket : ticket.tier === selectedTab,
          )}
        selectedIds={selectedIds}
        onSelectIds={onToggle}
      />
      <ErrorComponent error={error} />
    </div>
  );
}
