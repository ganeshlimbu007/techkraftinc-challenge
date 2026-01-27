import { ReservationItem } from "../tickets/ticket.type";
import { ReservationRow } from "./bookings.type";
import { createReservationTx } from "./reservation.repo";

export class BookingService {
  static async createReservation(
    items: ReservationItem[],
  ): Promise<ReservationRow> {
    // Business-level validation
    if (!items.length) {
      throw new Error("NO_ITEMS_PROVIDED");
    }

    for (const item of items) {
      if (item.quantity <= 0) {
        throw new Error("INVALID_QUANTITY");
      }
    }

    // Delegate to repo
    return createReservationTx({ items });
  }
}
