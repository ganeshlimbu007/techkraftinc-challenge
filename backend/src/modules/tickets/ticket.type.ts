import { TicketStatus } from "../../data/enums/booking-status";
import { TICKET_PRICING, TicketTier } from "../../data/enums/ticket-tier";

export type TicketTierType = typeof TicketTier;

export type TicketPriceType =
  (typeof TICKET_PRICING)[keyof typeof TICKET_PRICING];

export type TicketStatusType = `${TicketStatus}`;

export interface TicketRow {
  id: string;
  tier: TicketStatusType;
  price: number;
  status: TicketStatus;
  reservation_id: string | null;
  created_at: Date;
}

export interface CreateTicketInput {
  tier: TicketTierType;
  totalQuantity: number;
}

export type ReservationItem = {
  ticketIds: string[];
};
