import { BookingErrorCode } from "../../data/enums/booking-status";
import { ConflictError } from "../../utils/errors/conflict-error";
import { createBookingTx } from "./bookings.repo";

export async function createBooking(input: {
  ticketId: string;
  quantity: number;
}) {
  const paymentSuccess = processDummyPayment();

  try {
    return await createBookingTx({
      ticketId: input.ticketId,
      quantity: input.quantity,
      onPaymentSuccess: () => {
        if (!paymentSuccess) {
          throw new Error("PAYMENT_FAILED");
        }
      },
    });
  } catch (err: any) {
    if (err.message === BookingErrorCode.INSUFFICIENT_INVENTORY) {
      throw new ConflictError("Not enough tickets available");
    }

    if (err.message === BookingErrorCode.TICKET_NOT_FOUND) {
      throw new ConflictError("Ticket not found");
    }

    if (err.message === BookingErrorCode.PAYMENT_FAILED) {
      throw new ConflictError("Payment failed");
    }

    throw err;
  }
}
