import express, { Request, Response } from "express";
import { BookingService } from "./booking.service";

const router = express.Router();

router.post("/bookings/reservations", async (req: Request, res: Response) => {
  try {
    const { items } = req.body;

    const reservation = await BookingService.createReservation(items);

    res.status(201).json({
      reservationToken: reservation.token,
      expiresAt: reservation.expires_at,
    });
  } catch (err: any) {
    res.status(400).json({
      message: err.message || "Failed to create reservation",
    });
  }
});

export { router as bookingRouter };
