import { Ticket } from "@/src/data/types/ticket";
import { api } from "@/src/lib/api";

interface GetTicketsResponse {
  tickets: Ticket[];
}

export async function fetchTickets(): Promise<Ticket[]> {
  const res = await api.get<GetTicketsResponse>("/tickets");

  console.log("data", res);
  // Explicit runtime safety
  if (!res.data) {
    throw new Error("Invalid tickets response");
  }

  return res.data.tickets;
}
