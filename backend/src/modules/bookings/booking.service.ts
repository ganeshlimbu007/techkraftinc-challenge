import { ReservationItem } from "../tickets/ticket.type";
import { ReservationRow } from "./bookings.type";
import { createReservationTx } from "./reservation.repo";

export class BookingService {
  static async createReservation(ticketIds: string[]): Promise<ReservationRow> {
    if (!ticketIds.length) {
      throw new Error("NO_ITEMS_PROVIDED");
    }

    // Delegate to repo
    return createReservationTx({ ticketIds });
  }
}
