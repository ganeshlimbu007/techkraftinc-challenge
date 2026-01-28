import { getApiErrorMessage } from "@/src/lib/api-error";
import { confirmBooking } from "./payment-api";
interface PaymentConfirmResult {
  bookingId: string;
  status: "CONFIRMED";
}

export class PaymentService {
  /**
   * Confirm payment using fake card details
   * (card details are NOT sent to backend – demo only)
   */
  static async confirmPayment(params: {
    reservationToken: string;
    card: string;
  }): Promise<PaymentConfirmResult> {
    try {
      if (!params.reservationToken) {
        throw new Error("Missing reservation token");
      }

      const { card } = params;

      if (!card.trim().length) {
        throw new Error("Please fill in all card details");
      }

      const paymentIntentId = "dummy_" + params.card;

      return await confirmBooking({
        reservationToken: params.reservationToken,
        paymentIntentId,
      });
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  }
}
