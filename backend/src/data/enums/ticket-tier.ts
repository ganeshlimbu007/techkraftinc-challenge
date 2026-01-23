// src/data/enums/ticket-tier.ts

export enum TicketTier {
  VIP = "VIP",
  FRONT_ROW = "FRONT_ROW",
  GA = "GA",
}
export const TICKET_PRICING: Record<TicketTier, number> = {
  [TicketTier.VIP]: 100,
  [TicketTier.FRONT_ROW]: 50,
  [TicketTier.GA]: 10,
};

export type TicketDomain<T extends TicketTier = TicketTier> = {
  tier: T;
  price: (typeof TICKET_PRICING)[T];
};
