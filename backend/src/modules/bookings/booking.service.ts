import { BadRequestError } from "../../utils/errors/bad-request-error";

import { ReservationRow } from "./bookings.type";
import { createReservationTx } from "./reservation.repo";

export class BookingService {
  static async createReservation(ticketIds: string[]): Promise<ReservationRow> {
    if (!ticketIds.length) {
      throw new BadRequestError("NO_ITEMS_PROVIDED");
    }

    // Delegate to repo
    return createReservationTx({ ticketIds });
  }
}
