/* import { createReservationTx } from "./reservation.repo";
import { confirmReservationTx } from "./payment.repo";
import { BookingErrorCode } from "../../data/enums/booking-status";
import { ConflictError } from "../../utils/errors/conflict-error";

export async function reserveTickets(input: {
  ticketId: string;
  quantity: number;
}) {
  try {
    return await createReservationTx(input);
  } catch (err: any) {
    if (err.message === BookingErrorCode.INSUFFICIENT_INVENTORY) {
      throw new ConflictError("Not enough tickets available");
    }
    if (err.message === BookingErrorCode.TICKET_NOT_FOUND) {
      throw new ConflictError("Ticket not found");
    }
    throw err;
  }
}

export async function confirmPayment(input: {
  reservationToken: string;
  paymentIntentId: string;
}) {
  const paymentSuccess = Math.random() > 0.2;

  if (!paymentSuccess) {
    throw new ConflictError("Payment failed");
  }

  try {
    return await confirmReservationTx(input.reservationToken);
  } catch (err: any) {
    if (err.message === BookingErrorCode.RESERVATION_EXPIRED) {
      throw new ConflictError("Reservation expired");
    }
    if (err.message === BookingErrorCode.INVALID_TOKEN) {
      throw new ConflictError("Invalid reservation token");
    }
    throw err;
  }
}
 */

import { ReservationRow } from "./bookings.type";
import { confirmPaymentTx } from "./payment.repo";

export class PaymentService {
  static async confirmPayment(params: {
    reservationToken: string;
    paymentIntentId: string;
  }): Promise<ReservationRow> {
    if (!params.reservationToken) {
      throw new Error("MISSING_RESERVATION_TOKEN");
    }

    if (!params.paymentIntentId) {
      throw new Error("MISSING_PAYMENT_INTENT");
    }

    // Delegate to repo
    return confirmPaymentTx(params);
  }
}
