import { CreateReservationResponse } from "@/src/data/types/booking.type";
import { createReservation } from "./booking.api";
import { getApiErrorMessage } from "@/src/lib/api-error";

export class ReservationService {
  static async create(ticketIds: string[]): Promise<CreateReservationResponse> {
    try {
      if (!Array.isArray(ticketIds) || ticketIds.length === 0) {
        throw new Error("Please select at least one ticket");
      }

      return await createReservation({ ticketIds });
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  }
}
