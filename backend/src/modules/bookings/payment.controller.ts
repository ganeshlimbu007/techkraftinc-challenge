import express, { Request, Response } from "express";
import { PaymentService } from "./reservation.service";

const router = express.Router();

router.post(
  "/bookings/payments/confirm",
  async (req: Request, res: Response) => {
    try {
      const { reservationToken, paymentIntentId } = req.body;

      const booking = await PaymentService.confirmPayment({
        reservationToken,
        paymentIntentId,
      });

      res.status(200).json({
        bookingId: booking.id,
        status: booking.status,
      });
    } catch (err: any) {
      res.status(400).json({
        message: err.message || "Payment confirmation failed",
      });
    }
  },
);

export { router as paymentRouter };
