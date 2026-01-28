import {
  TicketStatusEnum as TicketStatusEnumType,
  TicketTierEnum,
} from "../enums/tickets.enum";

export type TicketStatus =
  (typeof TicketStatusEnumType)[keyof typeof TicketStatusEnumType];
export type TicketTier = (typeof TicketTierEnum)[keyof typeof TicketTierEnum];
export interface Ticket {
  id: string;
  tier: TicketTier;
  price: number;
  status: TicketStatus;
}
