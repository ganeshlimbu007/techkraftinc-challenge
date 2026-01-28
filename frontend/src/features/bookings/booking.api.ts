import {
  CreateReservationRequest,
  CreateReservationResponse,
} from "@/src/data/types/booking.type";
import { api } from "@/src/lib/api";
import { getApiErrorMessage } from "@/src/lib/api-error";

export async function createReservation(
  payload: CreateReservationRequest,
): Promise<CreateReservationResponse> {
  try {
    const res = await api.post<CreateReservationResponse>(
      "/bookings/reservations",
      payload,
    );

    if (!res.data || typeof res.data.reservationToken !== "string") {
      throw new Error("Invalid reservation response");
    }

    return res.data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err));
  }
}
