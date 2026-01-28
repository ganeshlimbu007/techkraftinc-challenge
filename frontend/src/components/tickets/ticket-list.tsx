"use client";
import { Ticket } from "@/src/data/types/ticket";
import { TicketCard } from "./ticket-card";
import { useState } from "react";

interface Props {
  tickets: Ticket[];
  selectedIds: string[];
  onSelectIds: (id: string) => void;
}

export function TicketList({ tickets, selectedIds, onSelectIds }: Props) {
  if (!tickets.length) {
    return <p className="text-gray-500">No tickets found</p>;
  }

  return (
    <div
      className=" py-8  grid gap-4
        grid-cols-3
        md:grid-cols-4
        lg:grid-cols-6
 "
    >
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          selected={selectedIds.includes(ticket.id)}
          onToggle={onSelectIds}
        />
      ))}
    </div>
  );
}
