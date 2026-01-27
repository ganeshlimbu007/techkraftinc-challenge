import { BadRequestError } from "../../utils/errors/bad-request-error";

import { ReservationRow } from "./bookings.type";
import { confirmPaymentTx } from "./payment.repo";

export class PaymentService {
  static async confirmPayment(params: {
    reservationToken: string;
    paymentIntentId: string;
  }): Promise<ReservationRow> {
    if (!params.reservationToken) {
      throw new BadRequestError("MISSING_RESERVATION_TOKEN");
    }

    if (!params.paymentIntentId) {
      throw new BadRequestError("MISSING_PAYMENT_INTENT");
    }

    // Delegate to repo
    return confirmPaymentTx(params);
  }
}
