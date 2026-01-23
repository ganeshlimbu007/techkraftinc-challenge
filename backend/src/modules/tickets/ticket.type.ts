import { TICKET_PRICING, TicketTier } from "../../data/enums/ticket-tier";

export type TicketTierType = typeof TicketTier;

export type TicketPriceType =
  (typeof TICKET_PRICING)[keyof typeof TICKET_PRICING];

export interface TicketRow {
  id: string;
  tier: TicketTierType;
  price: TicketPriceType;
  total_quantity: number;
  remaining_quantity: number;
  created_at: Date;
}
export interface CreateTicketInput {
  tier: TicketTierType;
  totalQuantity: number;
}
