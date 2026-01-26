import { BookingStatusEnum } from "../../data/enums/booking-status";

export type BookingStatus = `${BookingStatusEnum}`;

export interface BookingRow {
  id: string;
  ticket_id: string;
  quantity: number;
  status: BookingStatus;
  created_at: Date;
}

export interface CreateBookingInput {
  ticketId: string;
  quantity: number;
}

export interface ReservationRow {
  id: string;
  ticket_id: string;
  quantity: number;
  token: string;
  status: BookingStatus;
  expires_at: Date;
  created_at: Date;
}
