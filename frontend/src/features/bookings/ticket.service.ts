import { Ticket } from "@/src/data/types/ticket";
import { fetchTickets } from "./ticketing.api";
import { getApiErrorMessage } from "@/src/lib/api-error";

export class TicketsService {
  /**
   * Get all tickets
   */
  static async getAllTickets(): Promise<Ticket[]> {
    try {
      return await fetchTickets();
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  }

  /**
   * Get only available tickets
   */
  static async getAvailableTickets(): Promise<Ticket[]> {
    try {
      const tickets = await fetchTickets();
      return tickets.filter((t) => t.status === "AVAILABLE");
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  }

  /**
   * Group tickets by tier (useful for UI)
   */
  static async getTicketsGroupedByTier(): Promise<Record<string, Ticket[]>> {
    try {
      const tickets = await fetchTickets();

      return tickets.reduce(
        (acc, ticket) => {
          acc[ticket.tier] ||= [];
          acc[ticket.tier].push(ticket);
          return acc;
        },
        {} as Record<string, Ticket[]>,
      );
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  }
}
